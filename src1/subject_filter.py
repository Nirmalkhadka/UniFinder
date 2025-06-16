from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SubjectFilter:
    def __init__(self, course_titles):
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(course_titles)

    def filter_by_subject(self, user_subject, threshold=0.1):
        user_vec = self.vectorizer.transform([user_subject])
        similarities = cosine_similarity(user_vec, self.tfidf_matrix).flatten()
        # Returns indices of courses with similarity above threshold
        return np.where(similarities >= threshold)[0]