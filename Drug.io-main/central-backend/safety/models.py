from db.mongo import get_db
from datetime import datetime
from bson.objectid import ObjectId

class Safety:
    @staticmethod
    def add_safer_combination(drug_a, drug_b, risk_score, notes, created_by):
        db = get_db()
        combo = {
            "drug_a": drug_a,
            "drug_b": drug_b,
            "risk_score": risk_score,
            "notes": notes,
            "created_by": ObjectId(created_by),
            "created_at": datetime.utcnow()
        }
        db.safer_drug_combinations.insert_one(combo)

    @staticmethod
    def get_all_combinations():
        db = get_db()
        return list(db.safer_drug_combinations.find().sort("created_at", -1))
