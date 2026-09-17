from flask import Flask, jsonify, request, g
from flask_cors import CORS
from auth.routes import auth_bp
from users.routes import users_bp
from work_tracking.routes import work_bp
from safety.routes import safety_bp
from auth.middleware import token_required, token_optional
from services.admet_service import predict_admet
from services.dti_service import predict_dti
from services.synergy_service import predict_synergy, get_drugs, get_cancer_types
from work_tracking.models import WorkHistory
import os

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(work_bp, url_prefix='/api/work')
app.register_blueprint(safety_bp, url_prefix='/api/safety')

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Central Backend Running", "services": ["Auth", "AdmetProxy", "WorkTracking", "DTIProxy", "SynergyProxy"]}), 200

# Centralized Prediction Endpoint (ADMET)
@app.route('/api/predict', methods=['POST'])
@token_optional
def predict_central():
    import traceback
    try:
        data = request.get_json()
        print(f"DEBUG: data type: {type(data)}, data: {data}")

        # Handle list input (e.g. from batch requests or some clients)
        if isinstance(data, list):
            # If it's a list of strings, assume it's a list of SMILES
            if len(data) > 0 and isinstance(data[0], str):
                raw_smiles_input = data
            # If it's a list of dicts, try to find one with 'smiles' or merge them?
            # For now, let's assume if it is a list of dicts, we take the first one or iterate?
            # The code below expects raw_smiles_input to be a list or a string.
            elif len(data) > 0 and isinstance(data[0], dict):
                 # Extract smiles from each dict
                 raw_smiles_input = [d.get('smiles') for d in data if d.get('smiles')]
            else:
                 raw_smiles_input = []
        else:
             raw_smiles_input = data.get('smiles', '')
        
        # Ensure we have a list of SMILES
        smiles_list = []
        if isinstance(raw_smiles_input, list):
             smiles_list = raw_smiles_input
        elif isinstance(raw_smiles_input, str) and raw_smiles_input.strip():
             smiles_list = [raw_smiles_input]
        
        
        if not smiles_list:
            return jsonify({"error": "SMILES is required"}), 400

        # Helper function for parallel processing
        def process_single_smiles(raw_smi):
            if not isinstance(raw_smi, str):
                return None

            # Sanitize SMILES
            if isinstance(raw_smi, list):
                 if len(raw_smi) > 0 and isinstance(raw_smi[0], str):
                     raw_smi = raw_smi[0]
                 else:
                     return None

            smiles = str(raw_smi).strip().split(' ')[0]
            if not smiles:
                return None

            # Call ADMET service
            try:
                # We need to copy the context if we were using it, but here we just need smiles
                admet_result = predict_admet(smiles)
                
                # Unpack result
                mol_data = {}
                if admet_result and "molecules" in admet_result and len(admet_result["molecules"]) > 0:
                    mol_data = admet_result["molecules"][0]
                
                mol_data["type"] = "ADMET"
                
                # Return both smiles and result for history saving
                return (smiles, mol_data, admet_result)
            except Exception as e:
                print(f"Error processing {smiles}: {e}")
                return None

        # Execute in parallel
        from concurrent.futures import ThreadPoolExecutor, as_completed
        
        results_array = []
        
        # We need g.user for history saving. g is thread-local.
        # So we should save history in the main thread after collecting results,
        # OR pass the user_id to the worker (but saving requires app context if using flask-mongo)
        # Using main thread for saving is safer.
        
        # Determine max workers. 5 is reasonable for this use case.
        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_smiles = {executor.submit(process_single_smiles, smi): smi for smi in smiles_list}
            
            # Use a list to maintain order if possible, or just append
            # To maintain order, we map futures back to input?
            # actually users usually expect order to match input
            results_map = {}
            
            for i, raw_smi in enumerate(smiles_list):
               # convert to consistent key? No, just rely on list order is hard with futures
               # simpler: allow out of order or use map
               pass

            # Simpler approach using map if we want order, but map blocks.
            # let's use as_completed for speed, order might not matter as much or we fix it.
            # If we want to preserve order:
            futures = [executor.submit(process_single_smiles, smi) for smi in smiles_list]
            
            for future in futures:
                result = future.result()
                if result:
                    smiles, mol_data, admet_result = result
                    results_array.append(mol_data)
                    
                    # Save history if logged in
                    if hasattr(g, 'user') and g.user:
                         full_result = {
                            "admet": admet_result,
                            "type": "ADMET",
                            "modules_run": {
                                "admet": True,
                                "dti": False,
                                "synergy": False
                            }
                        }
                         try:
                             WorkHistory.save_query(g.user['_id'], smiles, full_result)
                         except Exception as e:
                             print(f"Failed to save history for {smiles}: {e}")
        
        return jsonify(results_array), 200
    except Exception as e:
        error_msg = f"PREDICTION ERROR: {str(e)}\n{traceback.format_exc()}\n"
        print(error_msg)
        try:
            with open("server_error.log", "a") as f:
                f.write(error_msg + "\n" + "-"*50 + "\n")
        except:
            pass
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route('/api/predict/target', methods=['POST'])
@token_optional
def predict_target():
    data = request.get_json()
    smiles = data.get('smiles')
    protein = data.get('protein_sequence')
    
    if not smiles or not protein:
        return jsonify({"error": "SMILES and Protein Sequence required"}), 400

    # Call DTI service
    dti_result = predict_dti(smiles, protein)
    
    # Save to history only if user is logged in
    if hasattr(g, 'user') and g.user:
        full_result = {
            "dti": dti_result,
            "type": "DTI",
            "modules_run": {
                "admet": False,
                "dti": True,
                "synergy": False
            }
        }
        WorkHistory.save_query(g.user['_id'], smiles, full_result)
    
    return jsonify(dti_result), 200

@app.route('/api/predict/synergy', methods=['POST'])
@token_optional
def predict_combination():
    data = request.get_json()
    # Synergy request has drug_a, drug_b, etc.
    # We'll save drug_a + " + " + drug_b as the 'smiles' key for history
    
    result = predict_synergy(data)
    
    # Save to history only if user is logged in
    if hasattr(g, 'user') and g.user:
        drug_a = data.get('drug_a', 'DrugA')
        drug_b = data.get('drug_b', 'DrugB')
        combo_key = f"{drug_a} + {drug_b}"
        
        full_result = {
            "synergy": result,
            "type": "Synergy",
            "modules_run": {
                "admet": False,
                "dti": False,
                "synergy": True
            }
        }
        
        WorkHistory.save_query(g.user['_id'], combo_key, full_result)
    
    return jsonify(result), 200

@app.route('/api/drugs', methods=['GET'])
def proxy_drugs():
    return jsonify(get_drugs())

@app.route('/api/cancer-types', methods=['GET'])
def proxy_cancer_types():
    return jsonify(get_cancer_types())

@app.route('/api/molecule-image', methods=['POST'])
def proxy_molecule_image():
    # Proxy to Synergy service
    data = request.get_json()
    import requests
    from services.synergy_service import SYNERGY_API_URL
    try:
        resp = requests.post(f"{SYNERGY_API_URL}/api/molecule-image", json=data)
        return jsonify(resp.json()), resp.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/batch-predict', methods=['POST'])
def proxy_batch_predict():
    data = request.get_json()
    import requests
    from services.synergy_service import SYNERGY_API_URL
    try:
        resp = requests.post(f"{SYNERGY_API_URL}/api/batch-predict", json=data)
        return jsonify(resp.json()), resp.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
