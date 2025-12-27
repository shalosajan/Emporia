import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def log(msg):
    print(f"[TEST] {msg}", flush=True)

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
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200 and len(response.json()) > 0:
        return response.json()[0]
    return None

def create_order(token, product_id):
    url = f"{BASE_URL}/api/orders/create/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "first_name": "Test",
        "last_name": "Payer",
        "email": "customer@test.com",
        "address": "123 Pay St",
        "postal_code": "111111",
        "city": "Pay City",
        "items": [{"product_id": product_id, "quantity": 1}]
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        return response.json()['id']
    else:
        log(f"Order creation failed: {response.text}")
        return None

def verify_razorpay_order(token, order_id):
    url = f"{BASE_URL}/api/orders/pay/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"order_id": order_id}
    
    log(f"Initiating Razorpay order for local order ID: {order_id}")
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        rzp_data = response.json()
        rzp_id = rzp_data.get('razorpay_order_id')
        if rzp_id and rzp_id.startswith("order_"):
            log(f"Success! Razorpay Order ID generated: {rzp_id}")
            return True
        else:
            log(f"Failed to get valid Razorpay ID. Response: {rzp_data}")
            return False
    else:
        log(f"Razorpay API call failed: {response.status_code} {response.text}")
        return False

def main():
    email = "customer@test.com"
    password = "password123"
    
    token = login_user(email, password)
    if not token:
        sys.exit(1)
        
    product = get_product(token)
    if not product:
        log("No products available to test.")
        sys.exit(1)
        
    order_id = create_order(token, product['id'])
    if not order_id:
        sys.exit(1)
        
    if verify_razorpay_order(token, order_id):
        log("Payment Verification Complete: Backend is correctly configured.")
    else:
        log("Payment Verification Failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
