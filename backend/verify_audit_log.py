import os
import django
import requests
import json

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from users.models import AuditLog, CustomUser

BASE_URL = "http://127.0.0.1:8000/api"
EMAIL = "superuser@test.com"
PASSWORD = "adminpass123"

def run_test():
    print(f"--- Verifying Audit Log for {EMAIL} ---")
    
    # 1. Login
    login_url = f"{BASE_URL}/auth/token/"
    resp = requests.post(login_url, json={"email": EMAIL, "password": PASSWORD})
    if resp.status_code != 200:
        print(f"[FAIL] Login failed: {resp.text}")
        return
    
    tokens = resp.json()
    access_token = tokens['access']
    headers = {"Authorization": f"Bearer {access_token}"}
    print("[OK] Logged in as SuperUser.")
    
    # 2. Create Dummy Staff
    create_url = f"{BASE_URL}/auth/admin/staff/"
    staff_data = {
        "email": "audit_test_staff@test.com",
        "username": "audit_test",
        "password": "password123",
        "role_level": "SUPPORT",
        "department": "Test Dept"
    }
    
    print("Creating Test Staff...")
    resp = requests.post(create_url, json=staff_data, headers=headers)
    
    if resp.status_code != 201:
        # If it failed, maybe user exists from previous failed run?
         print(f"[WARN] Create Staff failed (maybe exists?): {resp.status_code} {resp.text}")
         # Try to find it to delete it
         user = CustomUser.objects.filter(email=staff_data['email']).first()
         if user:
             staff_id = user.id
         else:
             return
    else:
        staff_id = resp.json()['id']
        print(f"[OK] Test Staff Created (ID: {staff_id})")

    # 3. Verify Creation Log
    last_log = AuditLog.objects.filter(action="CREATED_STAFF", target=staff_data['email']).last()
    if last_log:
        print(f"[SUCCESS] Audit Log Found: {last_log}")
    else:
        print(f"[FAIL] No Audit Log found for creation of {staff_data['email']}")
        
    # 4. Delete Staff
    print(f"Deleting Staff ID {staff_id}...")
    delete_url = f"{BASE_URL}/auth/admin/staff/{staff_id}/"
    resp = requests.delete(delete_url, headers=headers)
    
    if resp.status_code == 204:
        print("[OK] Test Staff Deleted.")
    else:
        print(f"[FAIL] Delete failed: {resp.status_code} {resp.text}")

    # 5. Verify Deletion Log
    last_del_log = AuditLog.objects.filter(action="DELETED_STAFF", target=staff_data['email']).last()
    if last_del_log:
         print(f"[SUCCESS] Audit Log Found: {last_del_log}")
    else:
         print(f"[FAIL] No Audit Log found for deletion of {staff_data['email']}")

if __name__ == "__main__":
    run_test()
