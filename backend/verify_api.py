import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def log(msg):
    print(f"[TEST] {msg}")

def register_user(email, username, password, role):
    url = f"{BASE_URL}/api/auth/register/"
    data = {
        "email": email,
        "username": username,
        "password": password,
        "password2": password,
        "role": role
    }
    log(f"Registering user: {email}")
    response = requests.post(url, json=data)
    if response.status_code == 201:
        log("Registration successful.")
        return True
    elif "already exists" in response.text:
        log("User already exists. Proceeding.")
        return True
    else:
        log(f"Registration failed: {response.status_code} {response.text}")
        return False

def login_user(email, password):
    url = f"{BASE_URL}/api/auth/token/"
    data = {"email": email, "password": password}
    log(f"Logging in user: {email}")
    response = requests.post(url, json=data)
    if response.status_code == 200:
        log("Login successful.")
        return response.json()['access']
    else:
        log(f"Login failed: {response.status_code} {response.text}")
        return None

def create_product(token, name, category_id):
    url = f"{BASE_URL}/api/seller/dashboard/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": name,
        "description": "Test Description",
        "price": 99.99,
        "stock": 10,
        "category": category_id
    }
    # Note: Expecting multipart/form-data usually, but let's try json if the view supports it, 
    # OR simpler: just send data as form fields which requests does automatically if 'data' is used instead of 'json'
    # The view uses ProductSerializer.
    
    log(f"Creating product: {name}")
    response = requests.post(url, data=data, headers=headers) 
    if response.status_code == 201:
        log("Product created successfully.")
        return response.json()
    else:
        log(f"Product creation failed: {response.status_code} {response.text}")
        return None

def get_categories():
    url = f"{BASE_URL}/api/categories/"
    response = requests.get(url)
    if response.status_code == 200 and len(response.json()) > 0:
        return response.json()[0]['id']
    else:
        log("No categories found.")
        return None

def main():
    # 1. Setup Data
    email = "api_seller@test.com"
    username = "api_seller"
    password = "password123"
    
    # 2. Register
    if not register_user(email, username, password, "SELLER"):
        sys.exit(1)
        
    # 3. Login
    token = login_user(email, password)
    if not token:
        sys.exit(1)
        
    # 4. Get Category (We created 'Electronics' earlier)
    category_id = get_categories()
    if not category_id:
        log("Cannot create product without category. Exiting.")
        sys.exit(1)
        
    # 5. Create Product
    product = create_product(token, "API Test Product", category_id)
    if not product:
        sys.exit(1)
        
    log("Verification Complete: Success.")

if __name__ == "__main__":
    main()
