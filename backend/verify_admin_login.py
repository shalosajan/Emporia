import requests

BASE_URL = "http://127.0.0.1:8000/api/auth"
EMAIL = "superuser@test.com"
PASSWORD = "adminpass123"

def test_admin_login():
    print(f"Testing Admin Login for {EMAIL}...")
    
    url = f"{BASE_URL}/admin-login/"
    print(f"POST {url}")
    
    try:
        resp = requests.post(url, json={"email": EMAIL, "password": PASSWORD})
        
        print(f"Status Code: {resp.status_code}")
        if resp.status_code == 200:
            print("[SUCCESS] Admin Login Passed.")
            print(resp.json())
        else:
            print(f"[FAIL] Admin Login Failed: {resp.text}")
            
    except Exception as e:
        print(f"[ERROR] Request failed: {e}")

if __name__ == "__main__":
    test_admin_login()
