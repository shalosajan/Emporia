import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"
EMAIL = "superuser@test.com"
PASSWORD = "adminpass123"

def run_stats_check():
    print(f"--- Verifying Stats for {EMAIL} ---")
    
    # 1. Login
    login_url = f"{BASE_URL}/auth/admin-login/"
    resp = requests.post(login_url, json={"email": EMAIL, "password": PASSWORD})
    
    if resp.status_code != 200:
        print(f"[FAIL] Login failed: {resp.status_code}")
        return
    
    token = resp.json()['access']
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get Stats
    stats_url = f"{BASE_URL}/auth/admin/stats/"
    print(f"GET {stats_url}")
    
    resp = requests.get(stats_url, headers=headers)
    
    if resp.status_code == 200:
        print("[SUCCESS] Stats Fetched:")
        print(json.dumps(resp.json(), indent=2))
    else:
        print(f"[FAIL] Stats Failed: {resp.status_code} {resp.text}")

if __name__ == "__main__":
    run_stats_check()
