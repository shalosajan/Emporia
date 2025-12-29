import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"
EMAIL = "superuser@test.com"
PASSWORD = "adminpass123"

def run_checks():
    print(f"--- Verifying Admin Suite for {EMAIL} ---")
    
    # 1. Login
    login_url = f"{BASE_URL}/auth/admin-login/" # Use the secure endpoint
    try:
        resp = requests.post(login_url, json={"email": EMAIL, "password": PASSWORD})
    except Exception as e:
        print(f"[CRITICAL] Connection failed: {e}")
        return

    if resp.status_code != 200:
        print(f"[FAIL] Login failed: {resp.status_code} {resp.text}")
        return
    
    token = resp.json()['access']
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Logged in.")

    # 2. Stats
    print("\nChecking Stats...")
    resp = requests.get(f"{BASE_URL}/auth/admin/stats/", headers=headers)
    if resp.status_code == 200:
        print(f"[PASS] Stats: {resp.json()}")
    else:
        print(f"[FAIL] Stats: {resp.status_code} {resp.text}")

    # 3. Products
    print("\nChecking Products...")
    resp = requests.get(f"{BASE_URL}/store/admin/products/", headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        count = len(data) if isinstance(data, list) else len(data.get('results', []))
        print(f"[PASS] Products: found {count} items.")
    else:
        print(f"[FAIL] Products: {resp.status_code} {resp.text}")

    # 4. Categories
    print("\nChecking Categories...")
    resp = requests.get(f"{BASE_URL}/store/admin/categories/", headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        count = len(data) if isinstance(data, list) else len(data.get('results', []))
        print(f"[PASS] Categories: found {count} items.")
    else:
        print(f"[FAIL] Categories: {resp.status_code} {resp.text}")

    # 5. Users
    print("\nChecking Users...")
    resp = requests.get(f"{BASE_URL}/auth/admin/users/", headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        count = len(data) if isinstance(data, list) else len(data.get('results', []))
        print(f"[PASS] Users: found {count} items.")
    else:
        print(f"[FAIL] Users: {resp.status_code} {resp.text}")

if __name__ == "__main__":
    run_checks()
