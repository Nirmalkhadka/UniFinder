import pandas as pd
import numpy as np
import re
import joblib
from sklearn.preprocessing import StandardScaler

# Load the cleaned data
df = pd.read_csv('../data/processed/cleaned_data.csv')

# Extract numeric university ranking
def extract_rank(rank_str):
    if isinstance(rank_str, str):
        match = re.search(r'(\d+)', rank_str)
        if match:
            return int(match.group(1))
    return np.nan

# Apply ranking extraction and fill missing rankings with the median
df['universityRankingNum'] = df['universityRanking'].apply(extract_rank)
median_ranking = df['universityRankingNum'].median()
df['universityRankingNum'] = df['universityRankingNum'].fillna(median_ranking)  # Fill missing rankings

# Ensure country column exists
if 'country' not in df.columns:
    def map_country(location):
        location = str(location).lower()
        if 'australia' in location or 'aus' in location:
            return 'AUS'
        elif 'usa' in location or 'us' in location or 'united states' in location:
            return 'US'
        elif 'canada' in location or 'cad' in location:
            return 'CAD'
        elif 'new zealand' in location or 'nz' in location:
            return 'NZ'
        elif 'uk' in location or 'united kingdom' in location or 'england' in location:
            return 'UK'
        else:
            return 'Other'
    df['country'] = df['universityLocation'].apply(map_country)

# Ensure courseLevelSimplified column exists
if 'courseLevelSimplified' not in df.columns:
    def map_course_level(level):
        if not isinstance(level, str):
            return 'Other'
        level = level.lower()
        if 'bachelor' in level or 'undergraduate' in level:
            return 'Undergraduate'
        elif 'master' in level or 'postgraduate' in level or 'phd' in level:
            return 'Postgraduate'
        else:
            return 'Other'
    df['courseLevelSimplified'] = df['courseLevel'].apply(map_course_level)

# One-hot encode categorical columns (country and courseLevelSimplified)
df_enc = pd.get_dummies(df, columns=['country', 'courseLevelSimplified'], drop_first=False)

# Ensure all required one-hot columns exist, filling missing ones with False
required_countries = ['country_AUS', 'country_CAD', 'country_NZ', 'country_UK', 'country_US']
required_levels = ['courseLevelSimplified_Postgraduate', 'courseLevelSimplified_Undergraduate']
for col in required_countries + required_levels:
    if col not in df_enc.columns:
        df_enc[col] = False

# Use the unique_id from cleaned_data.csv
if 'unique_id' not in df_enc.columns:
    df_enc['uniqueID'] = range(len(df_enc))  # Fallback if unique_id is missing
else:
    df_enc['uniqueID'] = df_enc['unique_id']

# Select features for ML model
features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD']
one_hot_cols = required_countries + required_levels
all_features = features + one_hot_cols + ['universityRankingNum', 'uniqueID']

# Prepare the feature matrix X
X = df_enc[all_features]

# Impute missing numeric values with the median
numeric_features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']
X[numeric_features] = X[numeric_features].fillna(X[numeric_features].median())

# Scale numeric features only (IELTS, TOEFL, GPA, Tuition, Ranking)
scaler = StandardScaler()
X_scaled_num = scaler.fit_transform(X[numeric_features])
X_scaled_df = pd.DataFrame(X_scaled_num, columns=numeric_features, index=X.index)
joblib.dump(scaler, '../models/feature_scaler.joblib')  # Save the scaler

# Replace original numeric columns with scaled versions
X.update(X_scaled_df)

# Save the processed data with all features
X.to_csv('../data/processed/ml_ready_data_pervious.csv', index=False)

print("Data preprocessing completed! Saved ml_ready_data.csv with all unique IDs from cleaned_data.csv.")