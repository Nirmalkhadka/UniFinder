from flask import Flask, request, jsonify
import joblib
import pandas as pd
from send_user import preprocess_user_input, recommend, feature_cols, filter_by_scores_gpa_budget, filter_data_by_country_level, filter_by_course_subject  # Import necessary functions

app = Flask(__name__)

# Load the ML-ready dataset
ML_READY_DATA_PATH = '../data/processed/ml_ready_data.csv'
df = pd.read_csv(ML_READY_DATA_PATH)  # Ensure df is loaded

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """
    This endpoint accepts the user input as a JSON object, processes it,
    and returns the top 5 recommended universities.
    """
    try:
        # Get the user input data from the POST request
        user_input = request.get_json()

        # Ensure the input includes all necessary fields
        required_fields = ['minimumGPA', 'tuitionFeeUSD', 'subject']
        
        # Check for required fields (excluding exam type, as it's handled dynamically)
        for field in required_fields:
            if field not in user_input:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Dynamic country check - find any country field (like country_US, country_CAD, etc.)
        country = next((key.split('_')[1] for key in user_input if key.startswith('country_')), None)
        if not country:
            return jsonify({"error": "Country field (e.g., country_US) is required."}), 400

        # Handle course level
        course_level = next((key.split('_')[1] for key in user_input if key.startswith('courseLevelSimplified_')), None)
        if not course_level:
            return jsonify({"error": "Course level field (e.g., courseLevelSimplified_Undergraduate) is required."}), 400
        
        # If only Postgraduate is selected, set Undergraduate to 0 and vice versa
        if 'courseLevelSimplified_Postgraduate' in user_input:
            user_input['courseLevelSimplified_Undergraduate'] = 0
        else:
            user_input['courseLevelSimplified_Postgraduate'] = 0

        # Check if either IELTS or TOEFL is provided, not both
        if 'ieltsMarks' in user_input and 'toefl_ibt' in user_input:
            return jsonify({"error": "Please provide either IELTS or TOEFL score, not both."}), 400
        
        # If IELTS is provided, set TOEFL to 0, and vice versa
        if 'ieltsMarks' in user_input:
            user_input['toefl_ibt'] = 0
        elif 'toefl_ibt' in user_input:
            user_input['ieltsMarks'] = 0

        # Process the input (convert user input into the correct format)
        user_input_vector = preprocess_user_input(user_input, feature_cols)

        # Filter data based on user input
        df_filtered = filter_data_by_country_level(df, user_input, country, course_level)

        if df_filtered.empty:
            return jsonify({"error": "No universities found based on the input criteria"}), 400

        # Filter by course subject if present
        subject = user_input.get('subject', "")
        df_filtered = filter_by_course_subject(df_filtered, subject)

        if df_filtered.empty:
            return jsonify({"error": "No universities matched the course subject."}), 400

        # Further filter by scores, GPA, and budget
        df_filtered = filter_by_scores_gpa_budget(df_filtered, user_input)

        if df_filtered.empty:
            return jsonify({"error": "No universities meet the score, GPA, or budget criteria"}), 400

        # Get recommendations based on the processed input
        recommendations = recommend(df_filtered, user_input_vector)  # Pass user_input_vector to recommend function

        # Return the recommendations as a JSON response
        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
