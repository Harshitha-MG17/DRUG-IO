import requests
import json
import time

url = "http://localhost:5000/api/predict"
headers = {"Content-Type": "application/json"}
# Mimic the frontend input (list of SMILES strings)
smiles_list = [
    "CC(=O)NC1=CC=C(C=C1)O", # Aspirin
    "CC(C)CC1=CC=C(C=C1)C(C)C" # Ibuprofen
]
data = {"smiles": smiles_list}

print(f"Sending request with {len(smiles_list)} SMILES...")
start_time = time.time()
try:
    response = requests.post(url, headers=headers, json=data, timeout=60)
    print(f"Status Code: {response.status_code}")
    print(f"Time taken: {time.time() - start_time:.2f}s")
    try:
        json_resp = response.json()
        print(f"Response count: {len(json_resp)}")
        if len(json_resp) > 0:
            first_mol = json_resp[0]
            if "ADMET" in first_mol and first_mol["ADMET"]:
                print("SUCCESS: ADMET data found.")
            else:
                print("FAILURE: ADMET data MISSING.")
                print(json.dumps(first_mol, indent=2))
        else:
            print("FAILURE: Empty response list.")
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        print(f"Response Text: {response.text}")
except Exception as e:
    print(f"Error: {e}")
