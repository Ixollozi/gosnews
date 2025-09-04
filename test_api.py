#!/usr/bin/env python3
"""
Simple script to test API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_endpoint(endpoint, description):
    """Test a single endpoint"""
    print(f"\n{'='*50}")
    print(f"Testing: {description}")
    print(f"URL: {BASE_URL}{endpoint}")
    print('='*50)
    
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure Django is running on localhost:8000")
    except Exception as e:
        print(f"Error: {e}")

def main():
    print("Gosnews API Test Script")
    print("Make sure Django server is running: python manage.py runserver")
    
    # Test endpoints
    endpoints = [
        ("/home/?lang=uz", "Home data (Uzbek)"),
        ("/news/?lang=uz", "News list (Uzbek)"),
        ("/leaders/", "Leaders list"),
        ("/debts/", "Debts list"),
        ("/guides/?lang=uz", "Guides list (Uzbek)"),
        ("/partners/", "Partners list"),
        ("/categories/", "Categories list"),
    ]
    
    for endpoint, description in endpoints:
        test_endpoint(endpoint, description)
    
    print(f"\n{'='*50}")
    print("API Test Complete!")
    print("If you see errors, check:")
    print("1. Django server is running (python manage.py runserver)")
    print("2. Database has data (python manage.py migrate)")
    print("3. CORS is configured properly")
    print('='*50)

if __name__ == "__main__":
    main()




