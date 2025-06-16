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

df['universityRankingNum'] = df['universityRanking'].apply(extract_rank)
median_ranking = df['universityRankingNum'].median()
df['universityRankingNum'] = df['universityRankingNum'].fillna(median_ranking)

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

# One-hot encode categorical columns
df_enc = pd.get_dummies(df, columns=['country', 'courseLevelSimplified'], drop_first=False)

# Ensure all required one-hot columns exist
required_countries = ['country_AUS', 'country_CAD', 'country_NZ', 'country_UK', 'country_US']
required_levels = ['courseLevelSimplified_Postgraduate', 'courseLevelSimplified_Undergraduate']
for col in required_countries + required_levels:
    if col not in df_enc.columns:
        df_enc[col] = False

# Use unique_id
if 'unique_id' not in df_enc.columns:
    df_enc['uniqueID'] = range(len(df_enc))
else:
    df_enc['uniqueID'] = df_enc['unique_id']

# Select features
features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD']
one_hot_cols = required_countries + required_levels
all_features = features + one_hot_cols + ['universityRankingNum', 'uniqueID']

# Prepare feature matrix
X = df_enc[all_features]

# Custom imputation for toefl_ibt
def impute_toefl(row):
    if pd.isna(row['toefl_ibt']) or row['toefl_ibt'] == 0:
        if not pd.isna(row['ieltsMarks']) and row['ieltsMarks'] > 0:
            # Map IELTS to approximate TOEFL (e.g., IELTS 6.0 ≈ TOEFL 60)
            ielts_to_toefl = {
                5.5: 46, 6.0: 60, 6.5: 79, 7.0: 94, 7.5: 102, 8.0: 110
            }
            ielts = round(row['ieltsMarks'] * 2) / 2  # Round to nearest 0.5
            return ielts_to_toefl.get(ielts, 60)  # Default to 60
        return 60  # Default for missing IELTS/TOEFL
    return row['toefl_ibt']

X['toefl_ibt'] = X.apply(impute_toefl, axis=1)

# Impute other numeric features with median
numeric_features = ['ieltsMarks', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']
X[numeric_features] = X[numeric_features].fillna(X[numeric_features].median())

# Scale numeric features
scaler = StandardScaler()
X_scaled_num = scaler.fit_transform(X[numeric_features + ['toefl_ibt']])
X_scaled_df = pd.DataFrame(X_scaled_num, columns=numeric_features + ['toefl_ibt'], index=X.index)
joblib.dump(scaler, '../models/feature_scaler1.joblib')

# Replace numeric columns with scaled versions
X.update(X_scaled_df)

# Save processed data
X.to_csv('../data/processed/ml_ready_data1_old.csv', index=False)

print("Data preprocessing completed! Saved ml_ready_data.csv with updated TOEFL imputation.")