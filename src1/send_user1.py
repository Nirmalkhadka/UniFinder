import pandas as pd
import numpy as np
import joblib
from src2.keyword_matching import extract_keywords
from subject_filter import SubjectFilter

# Paths to data and model files
ML_READY_DATA_PATH = '../data/processed/ml_ready_data1.csv'
XGB_MODEL_PATH = '../models/xgboost_model_best1_ml_data1.joblib'
UNI_DATA_PATH = '../data/processed/uni.csv'
scaler = joblib.load('../models/feature_scaler1.joblib')

# Load ML features, model, scaler, and descriptive data
df = pd.read_csv(ML_READY_DATA_PATH)
xgb_model = joblib.load(XGB_MODEL_PATH)
uni_df = pd.read_csv(UNI_DATA_PATH)

# Initialize SubjectFilter with course titles
subject_filter = SubjectFilter(uni_df['courseTitle'].fillna(''))

# Feature columns for the model (match training order)
feature_cols = [
    'ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD',
    'country_AUS', 'country_CAD', 'country_NZ', 'country_UK', 'country_US',
    'courseLevelSimplified_Postgraduate', 'courseLevelSimplified_Undergraduate'
]

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
    
    # Primary filter: Keyword matching
    subject_keywords = extract_keywords(subject)
    matched_uni_ids = []
    for idx, title in uni_df['courseTitle'].fillna('').items():
        title_keywords = extract_keywords(title)
        if subject_keywords.intersection(title_keywords):
            matched_uni_ids.append(uni_df.at[idx, 'uniqueID'])
    
    if matched_uni_ids:
        return df[df['uniqueID'].isin(matched_uni_ids)]
    
    # Fallback: TF-IDF similarity if no keyword matches
    print("No exact keyword matches found. Using semantic similarity for subject filtering.")
    matched_indices = subject_filter.filter_by_subject(subject, threshold=0.1)
    if len(matched_indices) == 0:
        print("No universities matched the course subject keywords or semantic similarity.")
        return pd.DataFrame()
    
    matched_uni_ids = uni_df.iloc[matched_indices]['uniqueID'].tolist()
    return df[df['uniqueID'].isin(matched_uni_ids)]

def inverse_transform_features(df_row, scaler, predicted_rank):
    numeric_features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']
    
    scaled_vals = [
        df_row['ieltsMarks'],
        df_row['toefl_ibt'],
        df_row['minimumGPA'],
        df_row['tuitionFeeUSD'],
        predicted_rank
    ]
    
    scaled_vals = pd.DataFrame([scaled_vals], columns=numeric_features)
    
    raw_vals = scaler.inverse_transform(scaled_vals)[0]
    
    ielts_raw, toefl_raw, gpa_raw, tuition_raw, ranking_raw = raw_vals
    return ielts_raw, toefl_raw, gpa_raw, tuition_raw, int(round(ranking_raw))

def filter_by_scores_gpa_budget(df, user_input):
    numeric_features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']
    
    user_vals = pd.DataFrame([[
        user_input.get('ieltsMarks', 0),
        user_input.get('toefl_ibt', 0),
        user_input.get('minimumGPA', 0),
        user_input.get('tuitionFeeUSD', 0),
        0
    ]], columns=numeric_features)
    
    scaled_user_vals = scaler.transform(user_vals)
    
    user_input_scaled = {
        'ieltsMarks': scaled_user_vals[0, 0],
        'toefl_ibt': scaled_user_vals[0, 1],
        'minimumGPA': scaled_user_vals[0, 2],
        'tuitionFeeUSD': scaled_user_vals[0, 3]
    }

    if ('ieltsMarks' not in user_input or user_input.get('ieltsMarks', 0) == 0) and \
       ('toefl_ibt' not in user_input or user_input.get('toefl_ibt', 0) == 0):
        print("No universities found: At least one of IELTS or TOEFL score must be provided.")
        return pd.DataFrame()

    if user_input.get('ieltsMarks', 0) != 0:
        df = df[df['ieltsMarks'] <= user_input_scaled['ieltsMarks']]
        if df.empty:
            print(f"No universities found with minimum IELTS score <= {user_input['ieltsMarks']}.")
            return pd.DataFrame()

    if user_input.get('toefl_ibt', 0) != 0:
        df = df[df['toefl_ibt'] <= user_input_scaled['toefl_ibt']]
        if df.empty:
            print(f"No universities found with minimum TOEFL score <= {user_input['toefl_ibt']}.")
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
        return []

    # Ensure df_filtered has all feature_cols in correct order
    for col in feature_cols:
        if col not in df_filtered.columns:
            df_filtered[col] = 0
    df_filtered = df_filtered[feature_cols]

    predictions = xgb_model.predict(df_filtered)
    df_filtered = df_filtered.copy()

    df_filtered['predictedRanking'] = predictions

    merged = df_filtered.merge(
        uni_df[['uniqueID', 'universityName', 'courseTitle', 'courseDescription', 'universityDescription']],
        on='uniqueID',
        how='left'
    )

    top5 = merged.sort_values('predictedRanking').head(5)

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