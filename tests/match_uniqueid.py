import pandas as pd

ml_df = pd.read_csv('../data/processed/ml_ready_data1.csv')
uni_df = pd.read_csv('../data/processed/uni.csv')

ml_ids = set(ml_df['uniqueID'])
uni_ids = set(uni_df['uniqueID'])

print(f"ml_ready_data.csv uniqueIDs: {len(ml_ids)}")
print(f"uni.csv uniqueIDs: {len(uni_ids)}")
print(f"Common uniqueIDs: {len(ml_ids.intersection(uni_ids))}")
print(f"ml_ready_data.csv IDs not in uni.csv: {ml_ids - uni_ids}")
print(f"uni.csv IDs not in ml_ready_data.csv: {uni_ids - ml_ids}")