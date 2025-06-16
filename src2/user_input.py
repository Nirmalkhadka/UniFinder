import pandas as pd
import numpy as np
import joblib
from keyword_matching import extract_keywords

# Paths to data and model files
ML_READY_DATA_PATH = '../data/processed/ml_ready_data.csv'
XGB_MODEL_PATH = '../models/xgboost_model_best1.joblib'
UNI_DATA_PATH = '../data/processed/uni.csv'
SCALER_PATH = '../models/feature_scaler.joblib'  # Corrected path

# Load ML features, model, scaler, and descriptive data
df = pd.read_csv(ML_READY_DATA_PATH)
xgb_model = joblib.load(XGB_MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
uni_df = pd.read_csv(UNI_DATA_PATH)

# Feature columns for the model
feature_cols = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD'] + \
    [col for col in df.columns if col.startswith('country_') or col.startswith('courseLevelSimplified_')]

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

def filter_by_course_subject(df, subject):
    if not subject:
        return df
    subject_keywords = extract_keywords(subject)
    matched_uni_ids = []
    for idx, title in uni_df['courseTitle'].fillna('').items():
        title_keywords = extract_keywords(title)
        if subject_keywords.intersection(title_keywords):
            matched_uni_ids.append(uni_df.at[idx, 'uniqueID'])

    if not matched_uni_ids:
        print("No universities matched the course subject keywords.")
        return pd.DataFrame()

    return df[df['uniqueID'].isin(matched_uni_ids)]

def inverse_transform_features(df_row, scaler, predicted_rank):
    # Numeric features in order used during scaler training
    numeric_features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']
    
    # Extract scaled values
    scaled_vals = [
        df_row['ieltsMarks'],
        df_row['toefl_ibt'],
        df_row['minimumGPA'],
        df_row['tuitionFeeUSD'],
        predicted_rank
    ]
    
    # Reshape for inverse transform
    scaled_vals = pd.DataFrame([scaled_vals], columns=numeric_features)
    
    # Inverse transform
    raw_vals = scaler.inverse_transform(scaled_vals)[0]
    
    # Return human-readable values
    ielts_raw, toefl_raw, gpa_raw, tuition_raw, ranking_raw = raw_vals
    return ielts_raw, toefl_raw, gpa_raw, tuition_raw, int(round(ranking_raw))

def filter_by_scores_gpa_budget(df, user_input):
    # Numeric features for scaling
    numeric_features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']
    
    # Prepare user input as DataFrame
    user_vals = pd.DataFrame([[
        user_input.get('ieltsMarks', 0),
        user_input.get('toefl_ibt', 0),
        user_input.get('minimumGPA', 0),
        user_input.get('tuitionFeeUSD', 0),
        0  # Placeholder for universityRankingNum (not used in filtering)
    ]], columns=numeric_features)
    
    # Scale user input
    scaled_user_vals = scaler.transform(user_vals)
    
    user_input_scaled = {
        'ieltsMarks': scaled_user_vals[0, 0],
        'toefl_ibt': scaled_user_vals[0, 1],
        'minimumGPA': scaled_user_vals[0, 2],
        'tuitionFeeUSD': scaled_user_vals[0, 3]
    }

    if user_input_scaled['ieltsMarks'] < 0:
        df = df[df['ieltsMarks'] <= user_input_scaled['ieltsMarks']]
        if df.empty:
            print(f"No universities found meeting IELTS minimum score of {user_input['ieltsMarks']}.")
            return pd.DataFrame()

    if user_input_scaled['toefl_ibt'] < 0:
        df = df[df['toefl_ibt'] <= user_input_scaled['toefl_ibt']]
        if df.empty:
            print(f"No universities found meeting TOEFL minimum score of {user_input['toefl_ibt']}.")
            return pd.DataFrame()

    df = df[df['minimumGPA'] <= user_input_scaled['minimumGPA']]
    if df.empty:
        print(f"No universities found meeting minimum GPA of {user_input['minimumGPA']}.")
        return pd.DataFrame()

    df = df[df['tuitionFeeUSD'] <= user_input_scaled['tuitionFeeUSD']]
    if df.empty:
        print(f"No universities found within budget of {user_input['tuitionFeeUSD']} USD.")
        return pd.DataFrame()

    return df

def preprocess_user_input(user_input, feature_cols):
    vec = [user_input.get(col, 0) for col in feature_cols]
    return pd.DataFrame([vec], columns=feature_cols)

def recommend(df_filtered, user_input_vector):
    if df_filtered.empty:
        print("No universities found after applying all filters.")
        return

    predictions = xgb_model.predict(df_filtered[feature_cols])
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
        ielts_raw, toefl_raw, gpa_raw, tuition_raw, ranking_raw = inverse_transform_features(
            row, scaler, row['predictedRanking']
        )
        print("----------------------------")
        print(f"🏫 University: {row['universityName']}")
        print(f"📘 Course: {row['courseTitle']}")
        print(f"💵 Tuition (USD): ${tuition_raw:,.2f}")
        print(f"🧪 IELTS: {ielts_raw:.1f} | TOEFL: {toefl_raw:.0f}")
        print(f"🎓 GPA requirement: {gpa_raw:.2f}")
        print(f"🎓 Course Level: {row.get('courseLevelSimplified_Undergraduate', 0) and 'Undergraduate' or row.get('courseLevelSimplified_Postgraduate', 0) and 'Postgraduate'}")
        print(f"📈 Predicted Ranking: {ranking_raw}")
        print(f"📝 Course Description: {row['courseDescription']}")
        print(f"🏢 University Description: {row['universityDescription']}\n")

def main():
    user_input, subject, country, course_level = get_user_input()
    if user_input is None:
        return

    df_filtered = filter_data_by_country_level(df, country, course_level)
    if df_filtered.empty:
        return

    df_filtered = filter_by_course_subject(df_filtered, subject)
    if df_filtered.empty:
        return

    df_filtered = filter_by_scores_gpa_budget(df_filtered, user_input)
    if df_filtered.empty:
        return

    user_vec = preprocess_user_input(user_input, feature_cols)

    recommend(df_filtered, user_vec)

if __name__ == "__main__":
    main()