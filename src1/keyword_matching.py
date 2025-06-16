import re
from collections import Counter

# Basic text cleaning and tokenization
def clean_text(text):
    # Convert to lowercase, remove non-alphanumeric characters (optional)
    text = text.lower()
    # Extract words using regex (this can also remove punctuation)
    words = re.findall(r'\b\w+\b', text)
    return words

# Function to extract keywords by removing stopwords (simple approach)
def extract_keywords(text, stopwords=None):
    if stopwords is None:
        stopwords = {'the', 'of', 'and', 'in', 'for', 'with', 'on', 'to', 'a', 'an'}
    
    words = clean_text(text)
    # Remove stopwords from the list of words
    keywords = [word for word in words if word not in stopwords]
    return set(keywords)

# Function to match courses based on keyword overlap
def match_courses(selected_course_title, all_course_titles, threshold=0.5):
    """
    Match courses based on keyword overlap. 
    Courses with at least threshold fraction of keyword overlap will be returned.
    """
    selected_keywords = extract_keywords(selected_course_title)
    
    similar_courses = []
    
    for course_title in all_course_titles:
        course_keywords = extract_keywords(course_title)
        # Calculate the overlap ratio
        overlap = len(selected_keywords.intersection(course_keywords)) / len(selected_keywords)
        
        # If overlap exceeds the threshold, add to similar courses
        if overlap >= threshold:
            similar_courses.append(course_title)
    
    return similar_courses