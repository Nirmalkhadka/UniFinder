import pandas as pd
import json
import re
import os
from src2.keyword_matching import match_courses  # Import the function from the new module

RAW_DATA_PATH = '../data/raw/CleanedData1.json'
PROCESSED_DATA_PATH = '../data/processed/cleaned_data.csv'

# Currency exchange rates to USD
EXCHANGE_RATES = {
    'AUD': 0.65,
    'CAD': 0.75,
    'NZD': 0.60,
    'USD': 1.0,
    'GBP': 1.25
}

# Function to load raw data
def load_raw_data(json_path=RAW_DATA_PATH):
    print(f"Loading raw data from {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    df = pd.json_normalize(data)
    print(f"Raw Data Loaded: {df.shape[0]} rows and {df.shape[1]} columns.")
    print("Sample data:")
    print(df.head())
    return df

# Map country based on university location
def map_country(location):
    location = location.lower()
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

# Function to map course level based on the course description
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

# Function to extract TOEFL iBT score from the entry requirements string
def extract_toefl_ibt(text):
    if not isinstance(text, str):
        return None
    match = re.search(r'(ibt|internet based)[^\d]*(\d{1,3})', text.lower())
    if match:
        score = int(match.group(2))
        if 0 <= score <= 120:
            return score
    return None

# Function to clean IELTS score
def clean_ielts(val):
    try:
        return float(val)
    except:
        print(f"Invalid IELTS score: {val}")
        return None

# Function to clean GPA
def clean_gpa(val):
    try:
        return float(val)
    except:
        print(f"Invalid GPA: {val}")
        return None

# Extract currency and fee from the tuition fee string
def extract_fee_and_currency(fee_str):
    if not isinstance(fee_str, str):
        print(f"Invalid fee string: {fee_str}")
        return None, None
    currency = fee_str[:3]
    match = re.search(r'(\d+(?:,\d+)*)', fee_str.replace(',', ''))
    amount = float(match.group(1)) if match else None
    if amount is None:
        print(f"Unable to extract amount from: {fee_str}")
    return currency, amount

# Function to convert fee to USD using exchange rates
def convert_fee_to_usd(fee_str):
    currency, amount = extract_fee_and_currency(fee_str)
    if currency in EXCHANGE_RATES and amount is not None:
        converted = amount * EXCHANGE_RATES[currency]
        return converted
    else:
        print(f"Unable to convert fee: {fee_str}")
        return None

# Function to clean and tokenize text (for both user input and course titles)
def clean_text(text):
    text = text.lower()
    words = re.findall(r'\b\w+\b', text)
    return words

# Function to extract keywords dynamically based on the user input and course titles
def extract_keywords(text):
    stopwords = {'the', 'of', 'in', 'and', 'for', 'with', 'on', 'to', 'a', 'an'}
    words = clean_text(text)
    keywords = [word for word in words if word not in stopwords]
    return set(keywords)

# Pre-filter courses based on the user-selected input and dynamic keyword extraction
def pre_filter_courses(user_input, all_courses):
    user_input_keywords = extract_keywords(user_input)
    filtered_courses = []
    for course_title in all_courses:
        course_keywords = extract_keywords(course_title)
        if any(keyword in course_keywords for keyword in user_input_keywords):
            filtered_courses.append(course_title)
    return filtered_courses

# Function to handle missing TOEFL values
def handle_missing_toefl(df):
    df['toefl_missing'] = df['toefl_ibt'].isnull()
    df['toefl_ibt'] = df['toefl_ibt'].fillna(0)
    print(f"Missing TOEFL handled: {df['toefl_missing'].sum()} rows flagged as missing.")
    return df

# Filter out courses that are not Bachelor or Master
def filter_course_levels(df):
    valid_levels = ['Undergraduate', 'Postgraduate']
    df_filtered = df[df['courseLevelSimplified'].isin(valid_levels)]
    print(f"Filtered by course level: {df_filtered.shape[0]} rows remaining.")
    return df_filtered

# Filter by country based on user input
def filter_by_country(df, selected_country):
    df_country = df[df['country'] == selected_country]
    print(f"Filtered by country ({selected_country}): {df_country.shape[0]} rows remaining.")
    return df_country

# Filter based on user inputs like GPA, IELTS, TOEFL, Budget
def filter_by_user_inputs(df, min_ielts=None, min_toefl=None, min_gpa=None, budget_min=None, budget_max=None):
    if min_ielts is not None:
        df = df[df['ieltsMarks'] >= min_ielts]
    if min_toefl is not None:
        df = df[df['toefl_ibt'] >= min_toefl]
    if min_gpa is not None:
        df = df[df['minimumGPA'] >= min_gpa]
    if budget_min is not None:
        df = df[df['tuitionFeeUSD'] >= budget_min]
    if budget_max is not None:
        df = df[df['tuitionFeeUSD'] <= budget_max]
    print(f"Data after user input filtering: {df.shape[0]} rows remaining.")
    return df

# Feature engineering pipeline to clean and prepare the dataset
def feature_engineering(df):
    print("Feature engineering in progress...")
    df['country'] = df['universityLocation'].apply(map_country)
    df['courseLevelSimplified'] = df['courseLevel'].apply(map_course_level)
    df['ieltsMarks'] = df['ieltsMarks'].apply(clean_ielts)
    df['toefl_ibt'] = df['entryRequirements'].apply(extract_toefl_ibt)
    df['minimumGPA'] = df['minimumGPA'].apply(clean_gpa)
    df['tuitionFeeUSD'] = df['tutionFee'].apply(convert_fee_to_usd)
    df_cleaned = df.dropna(subset=['country', 'courseLevelSimplified', 'ieltsMarks', 'minimumGPA', 'tuitionFeeUSD'])
    df_cleaned = filter_course_levels(df_cleaned)
    # Add unique_id column
    df_cleaned['unique_id'] = range(len(df_cleaned))
    print(f"Data after cleaning: {df_cleaned.shape[0]} rows remaining.")
    return df_cleaned

# Get recommendations based on pre-filtering and keyword matching
def get_filtered_course_recommendations(user_input, all_courses):
    filtered_courses = pre_filter_courses(user_input, all_courses)
    recommended_courses = match_courses(user_input, filtered_courses)
    return recommended_courses

# Save the processed data to CSV
def save_processed_data(df, path=PROCESSED_DATA_PATH):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)
    print(f"Processed data saved to {path}")

# Main function to load data, process, and recommend courses based on user input
def main():
    df = load_raw_data()
    df_cleaned = feature_engineering(df)
    df_cleaned = handle_missing_toefl(df_cleaned)
    print(df_cleaned.head())
    save_processed_data(df_cleaned)

if __name__ == "__main__":
    main()