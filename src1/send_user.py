import pandas as pd
import numpy as np
import joblib
from keyword_matching import extract_keywords

# Paths to data and model files
ML_READY_DATA_PATH = '../data/processed/ml_ready_data.csv'
XGB_MODEL_PATH = '../models/xgboost_model_best11.joblib'
UNI_DATA_PATH = '../data/processed/uni.csv'
scaler = joblib.load('../models/feature_scaler.joblib')

# Load ML features, model, scaler, and descriptive data
df = pd.read_csv(ML_READY_DATA_PATH)
xgb_model = joblib.load(XGB_MODEL_PATH)
uni_df = pd.read_csv(UNI_DATA_PATH)

# Feature columns for the model
feature_cols = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD'] + \
    [col for col in df.columns if col.startswith('country_') or col.startswith('courseLevelSimplified_')]

def filter_data_by_country_level(df, user_input, country, course_level):
    country_col = f'country_{country}'
    if country_col not in df.columns:
        print(f"No universities found in {country}.")
        return pd.DataFrame()
    df = df[df[country_col] == 1]
    if df.empty:
        print(f"No universities found in {country}.")
        return pd.DataFrame()

    level_col = f'courseLevelSimplified_{course_level}'
    df = df[df[level_col] == 1]
    if df.empty:
        print(f"No universities found for course level '{course_level}'.")
        return pd.DataFrame()

    return df

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

    # Check if neither IELTS nor TOEFL is provided or both are zero
    if ('ieltsMarks' not in user_input or user_input.get('ieltsMarks', 0) == 0) and \
       ('toefl_ibt' not in user_input or user_input.get('toefl_ibt', 0) == 0):
        print("No universities found: At least one of IELTS or TOEFL score must be provided.")
        return pd.DataFrame()

    # Filtering by IELTS if provided and non-zero
    if user_input.get('ieltsMarks', 0) != 0:
        df = df[df['ieltsMarks'] <= user_input_scaled['ieltsMarks']]
        if df.empty:
            print(f"No universities found with minimum IELTS score <= {user_input['ieltsMarks']}.")
            return pd.DataFrame()

    # Filtering by TOEFL if provided and non-zero
    if user_input.get('toefl_ibt', 0) != 0:
        df = df[df['toefl_ibt'] <= user_input_scaled['toefl_ibt']]
        if df.empty:
            print(f"No universities found with minimum TOEFL score <= {user_input['toefl_ibt']}.")
            return pd.DataFrame()

    # Filtering by GPA (user's GPA must meet or exceed minimum requirement)
    df = df[df['minimumGPA'] <= user_input_scaled['minimumGPA']]
    if df.empty:
        print(f"No universities found meeting minimum GPA of {user_input['minimumGPA']}.")
        return pd.DataFrame()

    # Filtering by tuition (within user's budget)
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
        return []

    predictions = xgb_model.predict(df_filtered[feature_cols])
    df_filtered = df_filtered.copy()

    # Add predicted ranking to the dataframe
    df_filtered['predictedRanking'] = predictions

    # Merge with uni_df to get descriptive info by uniqueID
    merged = df_filtered.merge(
        uni_df[['uniqueID', 'universityName', 'courseTitle', 'courseDescription', 'universityDescription']],
        on='uniqueID',
        how='left'
    )

    # Get top 5 recommended universities by predicted ranking
    top5 = merged.sort_values('predictedRanking').head(5)

    # Prepare the response
    recommendations = []
    for _, row in top5.iterrows():
        ielts_raw, toefl_raw, gpa_raw, tuition_raw, ranking_raw = inverse_transform_features(
            row, scaler, row['predictedRanking']
        )
        recommendations.append({
            "university_name": row['universityName'],
            "course_title": row['courseTitle'],
            "tuition_fee_usd": tuition_raw,
            "ielts": ielts_raw,
            "toefl": toefl_raw,
            "gpa_requirement": gpa_raw,
            "course_level": 'Undergraduate' if row['courseLevelSimplified_Undergraduate'] else 'Postgraduate',
            "predicted_ranking": ranking_raw,
            "course_description": row['courseDescription'],
            "university_description": row['universityDescription']
        })
    
    return recommendations