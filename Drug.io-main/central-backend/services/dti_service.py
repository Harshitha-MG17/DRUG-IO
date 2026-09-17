import requests
import os

DTI_API_URL = os.getenv("DTI_API_URL", "http://localhost:5002")

def predict_dti(smiles, protein_sequence):
    try:
        response = requests.post(f"{DTI_API_URL}/api/predict", json={"smiles": smiles, "protein_sequence": protein_sequence})
        if response.status_code == 200:
            return response.json()
        return {"error": f"DTI Service Error: {response.text}"} 
    except Exception as e:
        print(f"Error calling DTI service: {e}")
        return {"error": str(e)}
