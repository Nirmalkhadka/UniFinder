import pandas as pd
import joblib
df = pd.read_csv('../data/processed/ml_ready_data.csv')
scaler = joblib.load('../models/feature_scaler.joblib')
uk_undergrad = df[(df['country_UK'] == 1) & (df['courseLevelSimplified_Undergraduate'] == 1)]
raw_vals = scaler.inverse_transform(uk_undergrad[['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']])
print(pd.DataFrame(raw_vals, columns=['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD', 'universityRankingNum']).describe())