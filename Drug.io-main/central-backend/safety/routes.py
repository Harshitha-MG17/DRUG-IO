from flask import Blueprint, request, jsonify, g
from auth.middleware import token_required, role_required
from safety.models import Safety

safety_bp = Blueprint('safety', __name__)

@safety_bp.route('/', methods=['GET'])
@safety_bp.route('/combinations', methods=['GET'])
@token_required
def get_combinations():
    combos = Safety.get_all_combinations()
    for c in combos:
        c['_id'] = str(c['_id'])
        c['created_by'] = str(c['created_by'])
    return jsonify(combos), 200

@safety_bp.route('/', methods=['POST'])
@safety_bp.route('/combinations', methods=['POST'])
@token_required
@role_required(['pharmacologist', 'admin'])
def add_combination():
    data = request.get_json()
    Safety.add_safer_combination(
        data['drug_a'],
        data['drug_b'],
        data.get('risk_score', 0),
        data.get('notes', ''),
        g.user['_id']
    )
    return jsonify({'message': 'Combination added'}), 201
