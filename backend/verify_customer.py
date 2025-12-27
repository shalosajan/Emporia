import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def log(msg):
    print(f"[TEST] {msg}", flush=True)

def register_user(email, username, password, role):
    url = f"{BASE_URL}/api/auth/register/"
    data = {"email": email, "username": username, "password": password, "password2": password, "role": role}
    log(f"Registering user: {email}")
    response = requests.post(url, json=data)
    if response.status_code == 201 or "already exists" in response.text:
        log("Registration successful (or exists).")
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

def get_product(token):
    url = f"{BASE_URL}/api/products/"
    # Product list is public, but let's check auth anyway
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200 and len(response.json()) > 0:
        return response.json()[0]
    else:
        log("No products found.")
        return None

def create_order(token, product_id, qty):
    url = f"{BASE_URL}/api/orders/create/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "first_name": "Test",
        "last_name": "Customer",
        "email": "customer@test.com",
        "address": "123 Test St",
        "postal_code": "123456",
        "city": "Test City",
        "items": [
            {"product_id": product_id, "quantity": qty}
        ]
    }
    
    log(f"Creating order for product {product_id} x {qty}")
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        log("Order created successfully.")
        return response.json()
    else:
        log(f"Order creation failed: {response.status_code} {response.text}")
        return None

def main():
    email = "api_customer@test.com"
    username = "api_customer"
    password = "password123"
    
    if not register_user(email, username, password, "CUSTOMER"):
        sys.exit(1)
        
    token = login_user(email, password)
    if not token:
        sys.exit(1)
        
    product = get_product(token)
    if not product:
        log("Skipping order creation (no products).")
        sys.exit(1)
        
    order = create_order(token, product['id'], 1)
    if not order:
        sys.exit(1)
        
    log("Customer Verification Complete: Success.")

if __name__ == "__main__":
    main()
