import requests
import json

def test_execute_remote():
    url = "http://127.0.0.1:8000/api/execute/"
    
    # Test 1: Valid command (will likely fail connection but should hit the view)
    payload = {"command": "uptime"}
    print(f"Testing with payload: {payload}")
    
    try:
        # Note: login_required is on the view, so this might return 302 if not authenticated
        # For testing purposes, we can see if it at least reaches the server logic
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_execute_remote()
