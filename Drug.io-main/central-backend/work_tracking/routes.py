from flask import Blueprint, jsonify, g
from auth.middleware import token_required
from work_tracking.models import WorkHistory

work_bp = Blueprint('work', __name__)

@work_bp.route('/history', methods=['GET'])
@token_required
def get_history():
    history = WorkHistory.get_user_history(g.user['_id'])
    for h in history:
        h['_id'] = str(h['_id'])
        h['user_id'] = str(h['user_id'])
        
        # Ensure results object exists
        if 'results' not in h:
            h['results'] = {}
            
        # Inject default modules_run if missing (Backward Compatibility)
        if 'modules_run' not in h['results']:
            h['results']['modules_run'] = {
                "admet": True, 
                "dti": False, 
                "synergy": False
            }
            
    return jsonify(history), 200

@work_bp.route('/frequent', methods=['GET'])
@work_bp.route('/frequent-drugs', methods=['GET'])
@token_required
def get_frequent():
    frequent = WorkHistory.get_frequent_drugs(g.user['_id'])
    for f in frequent:
        f['_id'] = str(f['_id'])
        f['user_id'] = str(f['user_id'])
    return jsonify(frequent), 200
