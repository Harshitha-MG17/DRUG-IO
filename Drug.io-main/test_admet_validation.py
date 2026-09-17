import requests
import sys

# Configuration
ADMET_URL = "http://localhost:8080/predict"

def test_valid_smiles():
    print("Testing Valid SMILES (Aspirin)...")
    payload = {"smiles": "CC(=O)Oc1ccccc1C(=O)O"}
    try:
        response = requests.post(ADMET_URL, json=payload, timeout=10)
        if response.status_code == 200:
            print("✅ Valid SMILES passed.")
            return True
        else:
            print(f"❌ Valid SMILES failed. Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def test_invalid_smiles():
    print("\nTesting Invalid SMILES ('INVALID')...")
    payload = {"smiles": "INVALID_MOLECULE_STRING"}
    try:
        response = requests.post(ADMET_URL, json=payload, timeout=10)
        if response.status_code == 400:
            print(f"✅ Invalid SMILES correctly rejected. Response: {response.json()}")
            return True
        elif response.status_code == 200:
             print(f"❌ Invalid SMILES was ACCEPTED (Unexpected 200 OK). Response: {response.json()}")
             return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}. Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    print(f"Checking ADMET Service at {ADMET_URL}...")
    
    valid_pass = test_valid_smiles()
    invalid_pass = test_invalid_smiles()
    
    if valid_pass and invalid_pass:
        print("\n✅ ALL TESTS PASSED.")
        sys.exit(0)
    else:
        print("\n❌ TESTS FAILED.")
        sys.exit(1)
