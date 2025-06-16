import pandas as pd
import json
import re
import os

RAW_DATA_PATH = '../data/raw/CleanedData1.json'
PROCESSED_DATA_PATH = '../data/processed/cleaned_data2.csv'

EXCHANGE_RATES = {
    'AUD': 0.65,
    'CAD': 0.75,
    'NZD': 0.60,
    'USD': 1.0,
    'GBP': 1.25
}

def load_raw_data(json_path=RAW_DATA_PATH):
    print(f"Loading raw data from {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    df = pd.json_normalize(data)
    print(f"Raw Data Loaded: {df.shape[0]} rows, {df.shape[1]} columns.")
    return df

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

def map_course_level(level):
    if not isinstance(level, str):
        return 'Other'
    level = level.lower()
    if 'bachelor' in level or 'undergraduate' in level:
        return 'Undergraduate'
    elif 'master' in level or 'postgraduate' in level or 'phd' in level:
        return 'Postgraduate'
    return 'Other'

def extract_toefl_ibt(text):
    if not isinstance(text, str):
        return None
    text = text.lower()
    # Match patterns: "79", "79-93", "internet based: 90", "TOEFL iBT: 80", "TOEFL: 80"
    patterns = [
        r'(?:ibt|internet\s*based|toefl\s*ibt|toefl)[^\d]*(\d{1,3})(?:-(\d{1,3}))?',
        r'toefl[^\d]*(\d{1,3})(?:-(\d{1,3}))?'
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            score = int(match.group(1))
            if match.group(2):
                score = min(score, int(match.group(2)))
            if 0 <= score <= 120:
                return score
    return None

def impute_toefl(row):
    if pd.notna(row['toefl_ibt']) and 35 <= row['toefl_ibt'] <= 120:
        return row['toefl_ibt']
    if pd.notna(row['ieltsMarks']) and row['ieltsMarks'] > 0:
        ielts_to_toefl = {
            5.0: 35, 5.5: 46, 6.0: 60, 6.5: 79, 7.0: 94, 7.5: 102, 8.0: 110, 8.5: 115, 9.0: 118
        }
        ielts = round(row['ieltsMarks'] * 2) / 2
        return ielts_to_toefl.get(ielts, 60)
    return 60

def clean_ielts(val):
    try:
        score = float(val)
        if 0 <= score <= 9.0:
            return score
        print(f"Invalid IELTS score: {val}")
        return None
    except:
        print(f"Invalid IELTS score: {val}")
        return None

def clean_gpa(val):
    try:
        gpa = float(val)
        if 0 <= gpa <= 4.0:
            return gpa
        print(f"Invalid GPA: {val}")
        return None
    except:
        print(f"Invalid GPA: {val}")
        return None

def extract_fee_and_currency(fee_str):
    if not isinstance(fee_str, str):
        print(f"Invalid fee string: {fee_str}")
        return None, None
    currency = fee_str[:3].upper()
    match = re.search(r'(\d+(?:,\d+)*)(?:\s*\(\d{4}\))?', fee_str.replace(',', ''))
    amount = float(match.group(1)) if match else None
    if amount is None:
        print(f"Unable to extract amount from: {fee_str}")
    return currency, amount

def convert_fee_to_usd(fee_str):
    currency, amount = extract_fee_and_currency(fee_str)
    if currency in EXCHANGE_RATES and amount is not None:
        return amount * EXCHANGE_RATES[currency]
    print(f"Unable to convert fee: {fee_str}")
    return None

def feature_engineering(df):
    print("Feature engineering...")

    # Basic feature engineering
    df['country'] = df['universityLocation'].apply(map_country)
    df['courseLevelSimplified'] = df['courseLevel'].apply(map_course_level)

    # Clean features like IELTS, GPA, etc.
    df['ieltsMarks'] = df['ieltsMarks'].apply(clean_ielts)
    df['minimumGPA'] = df['minimumGPA'].apply(clean_gpa)
    df['tuitionFeeUSD'] = df['tutionFee'].apply(convert_fee_to_usd)
    df['toefl_ibt'] = df['entryRequirements'].apply(extract_toefl_ibt)

    # Add toefl handling and default if missing
    df['toefl_ibt'] = df.apply(impute_toefl, axis=1)

    # Remove outliers (if any) for these features
    df = df[(df['ieltsMarks'] >= 5) & (df['ieltsMarks'] <= 9)]  # IELTS should be between 5-9
    df = df[(df['minimumGPA'] >= 2) & (df['minimumGPA'] <= 4)]  # GPA between 2-4
    df = df[(df['tuitionFeeUSD'] >= 0)]  # Tuition fee should be non-negative

    # Remove rows with missing values for critical columns
    df_cleaned = df.dropna(subset=['country', 'courseLevelSimplified', 'ieltsMarks', 'minimumGPA', 'tuitionFeeUSD'])

    # Filter by valid levels
    valid_levels = ['Undergraduate', 'Postgraduate']
    df_cleaned = df_cleaned[df_cleaned['courseLevelSimplified'].isin(valid_levels)]

    print(f"Data after cleaning: {df_cleaned.shape[0]} rows remaining.")
    return df_cleaned


def save_processed_data(df, path=PROCESSED_DATA_PATH):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)
    print(f"Processed data saved to {path}")

def main():
    df = load_raw_data()
    df_cleaned = feature_engineering(df)
    save_processed_data(df_cleaned)

if __name__ == "__main__":
    main()