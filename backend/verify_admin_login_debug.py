import os
import django
import requests
import sys

# Setup Django
sys.path.append(r'c:\dev\Emporia\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from users.models import CustomUser

BASE_URL = "http://127.0.0.1:8000"

def test_admin_login(email, password):
    print(f"\n--- Testing Admin Login for {email} ---")
    
    # 1. Check User Status in DB
    try:
        user = CustomUser.objects.get(email=email)
        print(f"User Found: ID={user.id}, Role={user.role}")
        print(f"is_superuser={user.is_superuser}, is_staff={user.is_staff}, is_active={user.is_active}")
    except CustomUser.DoesNotExist:
        print("CRITICAL: User not found in database!")
        return

    # 2. Attempt Login via API
    url = f"{BASE_URL}/api/auth/admin-login/"
    payload = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("LOGIN SUCCESS!")
            print("Tokens received.")
            data = response.json()
            # Decode payload if possible or just print keys
            print("Response Keys:", data.keys())
        else:
            print(f"LOGIN FAILED: {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"Request Error: {e}")

if __name__ == "__main__":
    # Test with the known SuperUser
    test_admin_login("superuser@test.com", "admin123")
