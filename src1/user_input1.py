import pandas as pd
import numpy as np
import joblib
from src2.keyword_matching import extract_keywords  # Assuming you have a helper function to handle course subject keywords
import matplotlib.pyplot as plt

# Paths to data and model files
ML_READY_DATA_PATH = '../data/processed/ml_data6.csv'
GB_MODEL_PATH = '../models/gb_model_best.joblib'
UNI_DATA_PATH = '../data/processed/uni.csv'
SCALER_PATH = '../models/feature_scaler.joblib'  # Corrected path

# Load ML features, model, scaler, and descriptive data
df = pd.read_csv(ML_READY_DATA_PATH)
gb_model = joblib.load(GB_MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
uni_df = pd.read_csv(UNI_DATA_PATH)

# Feature columns for the model
feature_cols = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD'] + \
    [col for col in df.columns if col.startswith('country_') or col.startswith('courseLevelSimplified_')]


# Function to get user input
def get_user_input():
    user_input = {}

    # Country selection
    print("\nAvailable countries:", [col.split('_')[1] for col in df.columns if col.startswith('country_')])
    country = input("Enter country (e.g., US, UK, AUS): ").upper()
    if f'country_{country}' not in df.columns:
        print(f"Invalid country: {country}. Please choose from available countries.")
        return None, None, None, None
    user_input[f'country_{country}'] = 1
    for c in ['AUS', 'CAD', 'NZ', 'UK', 'US']:
        if c != country:
            user_input[f'country_{c}'] = 0

    # Course level selection
    print("Available course levels:", [col.split('_')[1] for col in df.columns if col.startswith('courseLevelSimplified_')])
    course_level = input("Enter course level (Undergraduate/Postgraduate): ").capitalize()
    if f'courseLevelSimplified_{course_level}' not in df.columns:
        print(f"Invalid course level: {course_level}. Please choose Undergraduate or Postgraduate.")
        return None, None, None, None
    user_input[f'courseLevelSimplified_{course_level}'] = 1
    other_level = 'Postgraduate' if course_level == 'Undergraduate' else 'Undergraduate'
    user_input[f'courseLevelSimplified_{other_level}'] = 0

    # Course subject keywords
    subject = input("Enter course subject keywords (e.g., Information Technology): ").strip()

    # English exam selection and score
    exam_type = ''
    while exam_type not in ['IELTS', 'TOEFL']:
        exam_type = input("Enter exam type (IELTS/TOEFL): ").upper()
        if exam_type not in ['IELTS', 'TOEFL']:
            print("Invalid exam type. Please enter IELTS or TOEFL.")
    try:
        score = float(input(f"Enter minimum {exam_type} score: "))
        if exam_type == 'IELTS' and (score < 0 or score > 9):
            print("IELTS score must be between 0 and 9.")
            return None, None, None, None
        if exam_type == 'TOEFL' and (score < 0 or score > 120):
            print("TOEFL score must be between 0 and 120.")
            return None, None, None, None
    except ValueError:
        print(f"Invalid {exam_type} score. Please enter a number.")
        return None, None, None, None
    user_input['ieltsMarks'] = score if exam_type == 'IELTS' else 0
    user_input['toefl_ibt'] = score if exam_type == 'TOEFL' else 0

    # Minimum GPA
    try:
        gpa = float(input("Enter minimum GPA (0-4): "))
        if gpa < 0 or gpa > 4:
            print("GPA must be between 0 and 4.")
            return None, None, None, None
        user_input['minimumGPA'] = gpa
    except ValueError:
        print("Invalid GPA. Please enter a number between 0 and 4.")
        return None, None, None, None

    # Maximum tuition fee (budget)
    try:
        tuition = float(input("Enter maximum tuition fee (USD): "))
        if tuition < 0:
            print("Tuition fee cannot be negative.")
            return None, None, None, None
        user_input['tuitionFeeUSD'] = tuition
    except ValueError:
        print("Invalid tuition fee. Please enter a number.")
        return None, None, None, None

    return user_input, subject, country, course_level


def filter_data_by_country_level(df, country, course_level):
    country_col = f'country_{country}'
    df_filtered = df[df[country_col] == 1]
    if df_filtered.empty:
        print(f"No universities found in {country}.")
        return pd.DataFrame()

    level_col = f'courseLevelSimplified_{course_level}'
    df_filtered = df_filtered[df_filtered[level_col] == 1]
    if df_filtered.empty:
        print(f"No universities found for course level '{course_level}'.")
        return pd.DataFrame()

    return df_filtered

def preprocess_user_input(user_input, feature_cols):
    # Convert user input to a DataFrame
    vec = [user_input.get(col, 0) for col in feature_cols]
    user_input_df = pd.DataFrame([vec], columns=feature_cols)
    
    # Add missing features (interaction and squared terms)
    user_input_df['ielts_toefl_interaction'] = user_input_df['ieltsMarks'] * user_input_df['toefl_ibt']
    user_input_df['gpa_tuition_interaction'] = user_input_df['minimumGPA'] * user_input_df['tuitionFeeUSD']
    user_input_df['ielts_squared'] = user_input_df['ieltsMarks'] ** 2
    user_input_df['toefl_squared'] = user_input_df['toefl_ibt'] ** 2
    
    return user_input_df


def recommend(df_filtered, user_input_vector):
    if df_filtered.empty:
        print("No universities found after applying all filters.")
        return

    predictions = gb_model.predict(df_filtered[feature_cols])
    df_filtered = df_filtered.copy()

    # Store predictions as scaled rankings
    df_filtered['predictedRanking'] = predictions

    # Merge with uni_df to get descriptive info by uniqueID
    merged = df_filtered.merge(
        uni_df[['uniqueID', 'universityName', 'courseTitle', 'courseDescription', 'universityDescription']],
        on='uniqueID',
        how='left'
    )

    top5 = merged.sort_values('predictedRanking').head(5)

    print("\n🎓 Top 5 Recommended Universities:\n")
    for _, row in top5.iterrows():
        print("----------------------------")
        print(f"🏫 University: {row['universityName']}")
        print(f"📘 Course: {row['courseTitle']}")
        print(f"💵 Tuition (USD): ${row['tuitionFeeUSD']:,.2f}")
        print(f"🧪 IELTS: {row['ieltsMarks']:.1f} | TOEFL: {row['toefl_ibt']:.0f}")
        print(f"🎓 GPA requirement: {row['minimumGPA']:.2f}")
        print(f"📈 Predicted Ranking: {row['predictedRanking']}")
        print(f"📝 Course Description: {row['courseDescription']}")
        print(f"🏢 University Description: {row['universityDescription']}\n")

def main():
    user_input, subject, country, course_level = get_user_input()
    if user_input is None:
        return

    df_filtered = filter_data_by_country_level(df, country, course_level)
    if df_filtered.empty:
        return

    user_vec = preprocess_user_input(user_input, feature_cols)

    recommend(df_filtered, user_vec)

if __name__ == "__main__":
    main()
