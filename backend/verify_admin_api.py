import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def log(message):
    print(f"[TEST] {message}")

def verify_admin_api():
    email = "superuser@test.com"
    password = "adminpass123"

    # 1. Login
    log("Logging in as superuser...")
    auth_url = f"{BASE_URL}/auth/token/"
    response = requests.post(auth_url, data={'email': email, 'password': password})
    
    if response.status_code != 200:
        log(f"Login failed: {response.text}")
        return

    tokens = response.json()
    access = tokens['access']
    headers = {'Authorization': f'Bearer {access}'}
    log("Login successful.")

    # 2. Get Stats
    log("Fetching Admin Stats...")
    stats_url = f"{BASE_URL}/auth/admin/stats/"
    response = requests.get(stats_url, headers=headers)
    if response.status_code == 200:
        log(f"Stats fetched: {response.json()}")
    else:
        log(f"Failed to fetch stats: {response.status_code} - {response.text}")

    # 3. Get User List
    log("Fetching Admin User List...")
    users_url = f"{BASE_URL}/auth/admin/users/"
    response = requests.get(users_url, headers=headers)
    if response.status_code == 200:
        users = response.json()
        log(f"Users fetched: {len(users)} users found.")
        # Check first user structure
        if users:
            log(f"Sample user: {users[0]}")
    else:
        log(f"Failed to fetch users: {response.status_code} - {response.text}")

    # 4. Get Order List
    log("Fetching Admin Order List...")
    orders_url = f"{BASE_URL}/orders/admin-orders/" # Corrected URL path
    response = requests.get(orders_url, headers=headers)
    if response.status_code == 200:
        orders = response.json()
        log(f"Orders fetched: {len(orders)} orders found.")
    else:
        log(f"Failed to fetch orders: {response.status_code} - {response.text}")

if __name__ == "__main__":
    verify_admin_api()
