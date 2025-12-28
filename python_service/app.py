import os
import joblib
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load Models
MODEL_DIR = os.path.join(os.path.dirname(__file__), '../aiModels')
TASK_PRIORITY_MODEL_PATH = os.path.join(MODEL_DIR, 'acadbox_task_priority_model.pkl')
HEALTH_MODEL_PATH = os.path.join(MODEL_DIR, 'acadbox_academic_health_model.pkl')

task_model = None
health_model = None

try:
    task_model = joblib.load(TASK_PRIORITY_MODEL_PATH)
    print(f"Task Priority Model loaded from {TASK_PRIORITY_MODEL_PATH}")
except Exception as e:
    print(f"Error loading Task Priority Model: {e}")

try:
    health_model = joblib.load(HEALTH_MODEL_PATH)
    print(f"Academic Health Model loaded from {HEALTH_MODEL_PATH}")
except Exception as e:
    print(f"Error loading Academic Health Model: {e}")

# Priority Mapping
PRIORITY_LABELS = {
    0: "Low",
    1: "Tomorrow",
    2: "Today"
}

@app.route('/predict', methods=['POST'])
def predict_task_priority():
    try:
        data = request.json
        print(f"\n[Task Priority] Received: {data}")
        
        # Extract features
        days_left = int(data.get('days_left'))
        task_type = int(data.get('task_type'))
        effort_hours = int(data.get('effort_hours'))
        course_credit = int(data.get('course_credit'))
        attendance_risk = int(data.get('attendance_risk'))
        consistency = float(data.get('consistency'))
        overdue_count = int(data.get('overdue_count'))

        # --- RULE-BASED OVERRIDES ---
        
        # Rule 1: Same-Day Exam Override
        if days_left == 0 and task_type == 2:
            response = {
                "priority_code": 2,
                "priority_label": "Today",
                "source": "rule"
            }
            print(f"[Task Priority] Sending: {response}")
            return jsonify(response)

        # Rule 2: Same-Day High-Effort Project
        if days_left <= 0 and task_type == 4 and effort_hours >= 6:
            response = {
                "priority_code": 2,
                "priority_label": "Today",
                "source": "rule"
            }
            print(f"[Task Priority] Sending: {response}")
            return jsonify(response)

        # --- AI MODEL PREDICTION ---
        if task_model:
            # Prepare input vector
            input_features = np.array([[
                days_left,
                task_type,
                effort_hours,
                course_credit,
                attendance_risk,
                consistency,
                overdue_count
            ]])
            
            prediction = task_model.predict(input_features)[0]
            priority_label = PRIORITY_LABELS.get(prediction, "Unknown")
            
            response = {
                "priority_code": int(prediction),
                "priority_label": priority_label,
                "source": "model"
            }
            print(f"[Task Priority] Sending: {response}")
            return jsonify(response)
        else:
            return jsonify({"error": "Task Priority Model not loaded"}), 500

    except Exception as e:
        print(f"[Task Priority] Error: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/predict-health', methods=['POST'])
def predict_health():
    try:
        data = request.json
        print(f"\n[Academic Health] Received: {data}")
        
        # Extract features
        task_completion_rate = float(data.get('task_completion_rate'))
        attendance_percent = float(data.get('attendance_percent'))
        average_grade = float(data.get('average_grade'))
        focus_hours_week = float(data.get('focus_hours_week'))
        streak_consistency = float(data.get('streak_consistency'))
        overdue_ratio = float(data.get('overdue_ratio'))

        # Validate ranges (Basic sanity check)
        if not (0 <= task_completion_rate <= 1): return jsonify({"error": "Invalid task_completion_rate"}), 400
        if not (0 <= attendance_percent <= 100): return jsonify({"error": "Invalid attendance_percent"}), 400
        if not (0 <= average_grade <= 10): return jsonify({"error": "Invalid average_grade"}), 400
        if not (0 <= focus_hours_week <= 168): return jsonify({"error": "Invalid focus_hours_week"}), 400 # Max hours in a week
        if not (0 <= streak_consistency <= 1): return jsonify({"error": "Invalid streak_consistency"}), 400
        if not (0 <= overdue_ratio <= 1): return jsonify({"error": "Invalid overdue_ratio"}), 400

        if health_model:
            input_features = np.array([[
                task_completion_rate,
                attendance_percent,
                average_grade,
                focus_hours_week,
                streak_consistency,
                overdue_ratio
            ]])
            
            score = health_model.predict(input_features)[0]
            
            # Clamp score
            score = max(0, min(100, score))
            
            # Determine Status
            status = "Critical"
            if score >= 90: status = "Excellent"
            elif score >= 75: status = "Strong"
            elif score >= 60: status = "Improving"
            elif score >= 40: status = "Needs Attention"
            
            response = {
                "academic_health_score": round(score, 1),
                "health_status": status
            }
            print(f"[Academic Health] Sending: {response}")
            return jsonify(response)
        else:
             return jsonify({"error": "Academic Health Model not loaded"}), 500

    except Exception as e:
        print(f"[Academic Health] Error: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    try:
        tasks = request.json.get('tasks', [])
        print(f"\n[Batch Predict] Received {len(tasks)} tasks")
        
        results = []
        
        for task in tasks:
            # Extract features
            days_left = int(task.get('days_left'))
            task_type = int(task.get('task_type'))
            effort_hours = int(task.get('effort_hours'))
            course_credit = int(task.get('course_credit'))
            attendance_risk = int(task.get('attendance_risk'))
            consistency = float(task.get('consistency'))
            overdue_count = int(task.get('overdue_count'))

            # --- RULE-BASED OVERRIDES ---
            rule_priority = None
            
            # Rule 1: Same-Day Exam Override
            if days_left == 0 and task_type == 2:
                rule_priority = 2

            # Rule 2: Same-Day High-Effort Project
            if days_left <= 0 and task_type == 4 and effort_hours >= 6:
                rule_priority = 2
            
            if rule_priority is not None:
                results.append({
                    "priority_code": rule_priority,
                    "priority_label": PRIORITY_LABELS[rule_priority],
                    "source": "rule"
                })
                continue

            # --- AI MODEL PREDICTION ---
            if task_model:
                input_features = np.array([[
                    days_left,
                    task_type,
                    effort_hours,
                    course_credit,
                    attendance_risk,
                    consistency,
                    overdue_count
                ]])
                
                prediction = task_model.predict(input_features)[0]
                priority_label = PRIORITY_LABELS.get(prediction, "Unknown")
                
                results.append({
                    "priority_code": int(prediction),
                    "priority_label": priority_label,
                    "source": "model"
                })
            else:
                results.append({"error": "Model not loaded", "priority_code": 0})

        print(f"[Batch Predict] Sending {len(results)} results")
        return jsonify({"predictions": results})

    except Exception as e:
        print(f"[Batch Predict] Error: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)
