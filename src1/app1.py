from flask import Flask, request, jsonify
import joblib
import pandas as pd
from send_user import preprocess_user_input, recommend, feature_cols, filter_by_scores_gpa_budget, filter_data_by_country_level, filter_by_course_subject

app = Flask(__name__)

ML_READY_DATA_PATH = '../data/processed/ml_ready_data.csv'
df = pd.read_csv(ML_READY_DATA_PATH)

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    try:
        user_input = request.get_json()
        print("Received data:", user_input)  # Log the received data

        required_fields = ['minimumGPA', 'tuitionFeeUSD', 'subject']
        for field in required_fields:
            if field not in user_input:
                return jsonify({"error": f"Missing field: {field}"}), 400

        country = next((key.split('_')[1] for key in user_input if key.startswith('country_')), None)
        if not country:
            return jsonify({"error": "Country field (e.g., country_US) is required."}), 400

        course_level = next((key.split('_')[1] for key in user_input if key.startswith('courseLevelSimplified_')), None)
        if not course_level:
            return jsonify({"error": "Course level field (e.g., courseLevelSimplified_Undergraduate) is required."}), 400

        # Initialize all country and course level fields
        countries = ['AUS', 'CAD', 'NZ', 'UK', 'US']
        for c in countries:
            user_input[f'country_{c}'] = 1 if c == country else 0

        user_input['courseLevelSimplified_Undergraduate'] = 1 if course_level == 'Undergraduate' else 0
        user_input['courseLevelSimplified_Postgraduate'] = 1 if course_level == 'Postgraduate' else 0

        if 'ieltsMarks' in user_input and 'toefl_ibt' in user_input:
            return jsonify({"error": "Please provide either IELTS or TOEFL score, not both."}), 400

        user_input['ieltsMarks'] = user_input.get('ieltsMarks', 0)
        user_input['toefl_ibt'] = user_input.get('toefl_ibt', 0)

        user_input_vector = preprocess_user_input(user_input, feature_cols)

        df_filtered = filter_data_by_country_level(df, user_input, country, course_level)
        if df_filtered.empty:
            return jsonify({"error": "No universities found based on the input criteria"}), 400

        subject = user_input.get('subject', "")
        df_filtered = filter_by_course_subject(df_filtered, subject)
        if df_filtered.empty:
            return jsonify({"error": "No universities matched the course subject."}), 400

        df_filtered = filter_by_scores_gpa_budget(df_filtered, user_input)
        if df_filtered.empty:
            return jsonify({"error": "No universities meet the score, GPA, or budget criteria"}), 400

        recommendations = recommend(df_filtered, user_input_vector)
        return jsonify(recommendations)

    except Exception as e:
        print("Error in Flask API:", str(e))  # Log any errors in Flask
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)