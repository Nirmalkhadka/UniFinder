import pandas as pd

# Load the original cleaned data
df = pd.read_csv('../data/processed/cleaned_data.csv')

# Generate a unique ID for each row (university-course pair)
df['uniqueID'] = df.index  # You can also create more complex unique IDs if needed

# Select columns for uni.csv
uni_df = df[['uniqueID', 'universityName', 'courseTitle', 'courseDescription', 'universityDescription']]

# Save to CSV
uni_df.to_csv('../data/processed/uni.csv', index=False)

print("uni.csv created successfully with uniqueID and descriptive columns.")
