import pandas as pd
import numpy as np
import re
import joblib
from sklearn.preprocessing import StandardScaler

def extract_rank(rank_str):
    if isinstance(rank_str, str):
        match = re.search(r'(\d+)', rank_str)
        if match:
            return int(match.group(1))
    return np.nan

df = pd.read_csv('../data/processed/cleaned_data1.csv')
df['universityRankingNum'] = df['universityRanking'].apply(extract_rank)
df['universityRankingNum'] = df['universityRankingNum'].fillna(df['universityRankingNum'].median())

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
    return 'Other'

if 'country' not in df.columns:
    df['country'] = df['universityLocation'].apply(map_country)

def map_course_level(level):
    if not isinstance(level, str):
        return 'Other'
    level = level.lower()
    if 'bachelor' in level or 'undergraduate' in level:
        return 'Undergraduate'
    elif 'master' in level or 'postgraduate' in level or 'phd' in level:
        return 'Postgraduate'
    return 'Other'

if 'courseLevelSimplified' not in df.columns:
    df['courseLevelSimplified'] = df['courseLevel'].apply(map_course_level)

df_enc = pd.get_dummies(df, columns=['country', 'courseLevelSimplified'], drop_first=False)

required_countries = ['country_AUS', 'country_CAD', 'country_NZ', 'country_UK', 'country_US']
required_levels = ['courseLevelSimplified_Postgraduate', 'courseLevelSimplified_Undergraduate']
for col in required_countries + required_levels:
    if col not in df_enc.columns:
        df_enc[col] = False

if 'unique_id' not in df_enc.columns:
    df_enc['uniqueID'] = range(len(df_enc))
else:
    df_enc['uniqueID'] = df_enc['unique_id']

numeric_features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']
features = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD']
one_hot_cols = required_countries + required_levels
all_features = features + one_hot_cols + ['universityRankingNum', 'uniqueID']

X = df_enc[all_features]

# Impute toefl_ibt with median to allow wider range
median_toefl = X['toefl_ibt'].median()
X['toefl_ibt'] = X['toefl_ibt'].fillna(median_toefl)

scaler = StandardScaler()
X_scaled_num = scaler.fit_transform(X[numeric_features])
X_scaled_df = pd.DataFrame(X_scaled_num, columns=numeric_features, index=X.index)
joblib.dump(scaler, '../models/feature_scaler_dp4.joblib')

X[numeric_features] = X_scaled_df[numeric_features]

X.to_csv('../data/processed/ml_data_dp4.csv', index=False)
print("Data preprocessing completed! Saved ml_data7.csv.")