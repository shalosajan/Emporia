import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def log(msg):
    print(f"[TEST] {msg}", flush=True)

def login_user(email, password):
    url = f"{BASE_URL}/api/auth/token/"
    data = {"email": email, "password": password}
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json()['access']
    return None

def create_product(token, name):
    url = f"{BASE_URL}/api/seller/dashboard/"
    headers = {"Authorization": f"Bearer {token}"}
    # We need a category ID. Assuming 1 exists from previous tests.
    data = {
        "name": name,
        "description": "Test Desc",
        "price": "10.00",
        "stock": 5,
        "category": 1, 
        "available": True
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        return response.json()
    else:
        log(f"Create Failed: {response.text}")
        return None

def update_product(token, slug, new_name):
    url = f"{BASE_URL}/api/seller/dashboard/{slug}/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"name": new_name}
    log(f"Updating product {slug} to name: {new_name}")
    response = requests.patch(url, json=data, headers=headers)
    if response.status_code == 200:
        log("Update Successful.")
        return True
    else:
        log(f"Update Failed: {response.status_code} {response.text}")
        return False

def delete_product(token, slug):
    url = f"{BASE_URL}/api/seller/dashboard/{slug}/"
    headers = {"Authorization": f"Bearer {token}"}
    log(f"Deleting product {slug}")
    response = requests.delete(url, headers=headers)
    if response.status_code == 204:
        log("Delete Successful.")
        return True
    else:
        log(f"Delete Failed: {response.status_code} {response.text}")
        return False

def main():
    email = "seller3@test.com"
    password = "password123"
    
    token = login_user(email, password)
    if not token:
        log("Login failed.")
        sys.exit(1)
        
    # 1. Create a temp product
    product = create_product(token, "ToBeDeleted")
    if not product:
        # Try to find it if it exists
        log("Could not create product, maybe category issue? Skipping create check.")
        sys.exit(1)
        
    slug = product['slug']
    log(f"Created product: {slug}")
    
    # 2. Update it
    if not update_product(token, slug, "UpdatedName"):
        sys.exit(1)
        
    # 3. Delete it
    # Note: Slug might verify-api-changed if we updated name? 
    # Since we used PATCH and model save updates slug? 
    # Let's check if slug changed. The model save logic creates slug IF NOT EXISTS.
    # It probably doesn't update slug on name change unless we force it.
    # Let's assume slug stays same for now.
    if not delete_product(token, slug):
        sys.exit(1)
        
    log("Seller Actions Verification Complete.")

if __name__ == "__main__":
    main()
