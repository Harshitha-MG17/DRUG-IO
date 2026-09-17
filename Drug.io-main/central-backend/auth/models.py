from db.mongo import get_db
from datetime import datetime
import bcrypt

class User:
    @staticmethod
    def create_user(name, email, password, role="researcher", created_by="system"):
        db = get_db()
        if db.users.find_one({"email": email}):
            raise ValueError("User already exists")

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user = {
            "name": name,
            "email": email,
            "password_hash": hashed_password,
            "role": role,
            "created_by": created_by,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = db.users.insert_one(user)
        return str(result.inserted_id)

    @staticmethod
    def verify_password(email, password):
        db = get_db()
        user = db.users.find_one({"email": email})
        if not user:
            return None
        
        if bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
            return user
        return None

    @staticmethod
    def get_by_id(user_id):
        from bson.objectid import ObjectId
        db = get_db()
        return db.users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def reset_password(user_id, new_password):
        from bson.objectid import ObjectId
        db = get_db()
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password_hash": hashed_password}}
        )
        return result.modified_count > 0
