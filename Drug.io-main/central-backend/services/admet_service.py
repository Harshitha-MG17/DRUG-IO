import requests
import os

ADMET_API_URL = os.getenv("ADMET_API_URL", "http://localhost:8080")

def predict_admet(smiles):
    try:
        # print(f"DEBUG: Calling ADMET service at {ADMET_API_URL}/predict with smiles={smiles}")
        response = requests.post(f"{ADMET_API_URL}/predict", json={"smiles": smiles}, timeout=120) 
        # print(f"DEBUG: ADMET service response status: {response.status_code}")
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 400:
            return response.json() # Return error message
        return None
    except Exception as e:
        print(f"Error calling ADMET service: {e}")
        return None
