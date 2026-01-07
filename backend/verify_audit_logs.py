import requests

def test_audit_logs():
    # 1. Login as SuperAdmin
    login_url = 'http://localhost:8000/api/auth/admin-login/'
    payload = {
        'email': 'superuser@test.com',
        'password': 'admin123'
    }
    
    print(f"Logging in to {login_url}...")
    try:
        resp = requests.post(login_url, json=payload)
        if resp.status_code != 200:
            print(f"Login Failed: {resp.status_code} - {resp.text}")
            return
        
        token = resp.json()['access']
        print("Login Success. Token obtained.")
        
        # 2. Fetch Audit Logs
        logs_url = 'http://localhost:8000/api/auth/admin/audit-logs/'
        headers = {'Authorization': f'Bearer {token}'}
        
        print(f"Fetching logs from {logs_url}...")
        log_resp = requests.get(logs_url, headers=headers)
        
        if log_resp.status_code == 200:
            data = log_resp.json()
            print(f"SUCCESS! Retrieved {len(data)} audit log entries.")
            if len(data) > 0:
                print("Sample Entry:")
                print(data[0])
        else:
            print(f"FAILED to fetch logs: {log_resp.status_code} - {log_resp.text}")

    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == '__main__':
    test_audit_logs()
