from db.mongo import get_db
from datetime import datetime
from bson.objectid import ObjectId

class WorkHistory:
    @staticmethod
    def save_query(user_id, smiles, results):
        db = get_db()
        record = {
            "user_id": ObjectId(user_id),
            "smiles": smiles,
            "results": results, # Unified results from various services
            "created_at": datetime.utcnow()
        }
        db.drug_queries.insert_one(record)
        
        # Update frequent drugs
        WorkHistory.update_frequent_drug(user_id, smiles)

    @staticmethod
    def update_frequent_drug(user_id, smiles):
        db = get_db()
        db.frequently_used_drugs.update_one(
            {"user_id": ObjectId(user_id), "smiles": smiles},
            {
                "$inc": {"usage_count": 1},
                "$set": {"last_used": datetime.utcnow()}
            },
            upsert=True
        )

    @staticmethod
    def get_user_history(user_id, limit=50):
        db = get_db()
        cursor = db.drug_queries.find({"user_id": ObjectId(user_id)}).sort("created_at", -1).limit(limit)
        return list(cursor)

    @staticmethod
    def get_frequent_drugs(user_id, limit=10):
        db = get_db()
        cursor = db.frequently_used_drugs.find({"user_id": ObjectId(user_id)}).sort("usage_count", -1).limit(limit)
        return list(cursor)
