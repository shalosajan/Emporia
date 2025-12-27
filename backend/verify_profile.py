import requests

BASE_URL = "http://127.0.0.1:8000"

def log(message):
    print(f"[TEST] {message}")

def verify_profile():
    # 1. Register/Login a test user for profile verification
    email = "profileuser@test.com"
    password = "password123"
    
    # Try to register
    # Note: registration is at /api/auth/register/
    requests.post(f"{BASE_URL}/api/auth/register/", json={
        "email": email,
        "username": "profileuser",
        "password": password,
        "password2": password
    })
    
    # Login
    log("Logging in...")
    # Note: Login is at /api/auth/token/
    resp = requests.post(f"{BASE_URL}/api/auth/token/", json={
        "email": email,
        "password": password
    })
    
    if resp.status_code != 200:
        log(f"Login failed: {resp.text}")
        return

    tokens = resp.json()
    access_token = tokens['access']
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 2. Get Initial Profile
    log("Fetching Profile...")
    # Note: Profile is at /api/auth/profile/
    resp = requests.get(f"{BASE_URL}/api/auth/profile/", headers=headers)
    if resp.status_code == 200:
        log("Profile Fetched Successfully.")
        print(resp.json())
    else:
        log(f"Failed to fetch profile: {resp.text}")
        return

    # 3. Update Profile
    update_data = {
        "first_name": "Test",
        "last_name": "User",
        "address": "123 Profile Lane",
        "city": "Testville",
        "postal_code": "90210"
    }
    log(f"Updating Profile with: {update_data}")
    resp = requests.patch(f"{BASE_URL}/api/auth/profile/", json=update_data, headers=headers) # Using PATCH
    
    if resp.status_code == 200:
        log("Profile Updated Successfully.")
        updated_profile = resp.json()
        print(updated_profile)
        
        # Verify fields
        if updated_profile['city'] == "Testville":
            log("City matches.")
        else:
            log("City mismatch!")
    else:
        log(f"Failed to update profile: {resp.text}")

if __name__ == "__main__":
    verify_profile()
