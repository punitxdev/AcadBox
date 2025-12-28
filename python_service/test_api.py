import requests
import json
import time
import sys

BASE_URL = "http://localhost:5001/predict"

def test_rule_override():
    print("\n--- Testing Rule Override (Exam) ---")
    payload = {
        "days_left": 0,
        "task_type": 2,
        "effort_hours": 4,
        "course_credit": 5,
        "attendance_risk": 0,
        "consistency": 0.3,
        "overdue_count": 0
    }
    try:
        response = requests.post(BASE_URL, json=payload)
        data = response.json()
        print(f"Input: {payload}")
        print(f"Output: {data}")
        
        if data.get("source") == "rule" and data.get("priority_label") == "Today":
            print("✅ PASS: Rule override worked correctly.")
        else:
            print("❌ FAIL: Rule override failed.")
    except Exception as e:
        print(f"❌ FAIL: Request error: {e}")

def test_model_prediction():
    print("\n--- Testing Model Prediction ---")
    payload = {
        "days_left": 10,
        "task_type": 4,
        "effort_hours": 25,
        "course_credit": 6,
        "attendance_risk": 0,
        "consistency": 0.6,
        "overdue_count": 0
    }
    try:
        response = requests.post(BASE_URL, json=payload)
        data = response.json()
        print(f"Input: {payload}")
        print(f"Output: {data}")
        
        if data.get("source") == "model":
            print("✅ PASS: Model prediction worked correctly.")
        else:
            print("❌ FAIL: Model prediction failed (expected source='model').")
    except Exception as e:
        print(f"❌ FAIL: Request error: {e}")

def test_invalid_input():
    print("\n--- Testing Invalid Input ---")
    payload = {
        "days_left": "invalid",
        "task_type": 2
    }
    try:
        response = requests.post(BASE_URL, json=payload)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 400:
             print("✅ PASS: Invalid input handled correctly.")
        else:
             print("❌ FAIL: Invalid input not handled (expected 400).")
    except Exception as e:
        print(f"❌ FAIL: Request error: {e}")

def test_health_prediction():
    print("\n--- Testing Academic Health Prediction ---")
    url = "http://localhost:5001/predict-health"
    
    # Case 1: Strong Student
    payload1 = {
        "task_completion_rate": 0.85,
        "attendance_percent": 92,
        "average_grade": 8.1,
        "focus_hours_week": 14,
        "streak_consistency": 0.8,
        "overdue_ratio": 0.1
    }
    try:
        response = requests.post(url, json=payload1)
        data = response.json()
        print(f"Input: {payload1}")
        print(f"Output: {data}")
        if "academic_health_score" in data and "health_status" in data:
             print("✅ PASS: Health prediction structure correct.")
        else:
             print("❌ FAIL: Invalid response structure.")
    except Exception as e:
        print(f"❌ FAIL: Request error: {e}")

    # Case 2: Struggling Student
    payload2 = {
        "task_completion_rate": 0.4,
        "attendance_percent": 60,
        "average_grade": 5.0,
        "focus_hours_week": 2,
        "streak_consistency": 0.2,
        "overdue_ratio": 0.5
    }
    try:
        response = requests.post(url, json=payload2)
        data = response.json()
        print(f"Input: {payload2}")
        print(f"Output: {data}")
    except Exception as e:
        print(f"❌ FAIL: Request error: {e}")

if __name__ == "__main__":
    # Wait for server to start if running in automation
    time.sleep(2)
    test_rule_override()
    test_model_prediction()
    test_invalid_input()
    test_health_prediction()
