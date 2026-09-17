from db.mongo import get_db
from auth.models import User
import os

def seed_admin():
    print("Seeding Admin User...")
    try:
        user_id = User.create_user("Admin User", "admin@drug.io", "admin123", "admin")
        print(f"Admin created with ID: {user_id}")
    except ValueError:
        print("Admin user already exists.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    seed_admin()
