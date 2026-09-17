import requests
import os

SYNERGY_API_URL = os.getenv("SYNERGY_API_URL", "http://localhost:5010")

def get_drugs():
    try:
        response = requests.get(f"{SYNERGY_API_URL}/api/drugs")
        if response.status_code == 200:
            return response.json()
        return {"error": "Failed to fetch drugs"}
    except Exception as e:
        print(f"Error fetching drugs: {e}")
        return {"drugs": []}

def get_cancer_types():
    try:
        response = requests.get(f"{SYNERGY_API_URL}/api/cancer-types")
        if response.status_code == 200:
            return response.json()
        return {"error": "Failed to fetch cancer types"}
    except Exception as e:
        print(f"Error fetching cancer types: {e}")
        return {"cancer_types": {}}

def predict_synergy(data):
    try:
        response = requests.post(f"{SYNERGY_API_URL}/api/predict", json=data)
        if response.status_code == 200:
            return response.json()
        return {"error": f"Synergy Service Error: {response.text}"}
    except Exception as e:
        print(f"Error calling Synergy service: {e}")
        return {"error": str(e)}
