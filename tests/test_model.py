import unittest
import pandas as pd
import numpy as np
from src1.send_user import filter_data_by_country_level, filter_by_scores_gpa_budget, preprocess_user_input, recommend
import joblib
import os

class TestRecommendationSystem(unittest.TestCase):

    def setUp(self):
        # Load the processed data for testing
        data_path = os.path.join('..', 'data', 'processed', 'ml_ready_data.csv')
        self.assertTrue(os.path.exists(data_path), f"Data file not found: {data_path}")
        self.df = pd.read_csv(data_path)

        # Load the pre-trained model for testing
        model_path = os.path.join('..', 'models', 'xgboost_model_best1.joblib')
        self.assertTrue(os.path.exists(model_path), f"Model file not found: {model_path}")
        self.model = joblib.load(model_path)

        # Define feature columns (must match training)
        self.feature_cols = ['ieltsMarks', 'toefl_ibt', 'minimumGPA', 'tuitionFeeUSD'] + \
                            [col for col in self.df.columns if col.startswith('country_') or col.startswith('courseLevelSimplified_')]

        # Create a mock dataset for testing
        self.df_filtered = self.df.copy()

    def test_filter_data_by_country(self):
        user_input = {'country_US': 1, 'courseLevelSimplified_Postgraduate': 1}
        df_filtered = filter_data_by_country_level(self.df_filtered, user_input, country='US', course_level='Postgraduate')
        self.assertGreater(df_filtered.shape[0], 0, "No universities found in the US for Postgraduate level.")

    def test_filter_data_by_ielts(self):
        user_input = {'ieltsMarks': 6.5}
        df_filtered = filter_by_scores_gpa_budget(self.df_filtered, user_input)
        self.assertGreater(df_filtered.shape[0], 0, "No universities found with minimum IELTS <= 6.5.")

    def test_filter_by_gpa(self):
        user_input = {'minimumGPA': 3.5}
        df_filtered = filter_by_scores_gpa_budget(self.df_filtered, user_input)
        self.assertGreater(df_filtered.shape[0], 0, "No universities found with minimum GPA <= 3.5.")

    def test_filter_by_budget(self):
        user_input = {'tuitionFeeUSD': 30000}
        df_filtered = filter_by_scores_gpa_budget(self.df_filtered, user_input)
        self.assertGreater(df_filtered.shape[0], 0, "No universities found within budget of $30,000.")

    def test_empty_input(self):
        user_input = {'ieltsMarks': 0, 'toefl_ibt': 0}
        df_filtered = filter_by_scores_gpa_budget(self.df_filtered, user_input)
        self.assertEqual(df_filtered.shape[0], 0, "Expected no universities when neither IELTS nor TOEFL is provided.")

    def test_no_matching_universities(self):
        user_input = {'country_US': 1, 'courseLevelSimplified_Postgraduate': 1, 'ieltsMarks': 9.5, 'minimumGPA': 4.5, 'tuitionFeeUSD': 1000}
        df_filtered = filter_data_by_country_level(self.df_filtered, user_input, country='US', course_level='Postgraduate')
        df_filtered = filter_by_scores_gpa_budget(df_filtered, user_input)
        self.assertEqual(df_filtered.shape[0], 0, "No universities should match the extreme input criteria.")

    def test_preprocess_user_input(self):
        user_input = {
            'ieltsMarks': 6.5,
            'toefl_ibt': 0,
            'minimumGPA': 3.5,
            'tuitionFeeUSD': 20000,
            'country_US': 1,
            'courseLevelSimplified_Undergraduate': 1
        }
        user_vec = preprocess_user_input(user_input, self.feature_cols)
        self.assertEqual(user_vec.shape[0], 1, "Preprocessing failed, expected 1 row.")
        self.assertEqual(user_vec.shape[1], len(self.feature_cols), f"Expected {len(self.feature_cols)} features, got {user_vec.shape[1]}.")

    def test_recommendations(self):
        user_input = {
            'ieltsMarks': 6.5,
            'toefl_ibt': 0,
            'minimumGPA': 3.5,
            'tuitionFeeUSD': 20000,
            'country_US': 1,
            'courseLevelSimplified_Undergraduate': 1
        }
        user_vec = preprocess_user_input(user_input, self.feature_cols)
        df_filtered = filter_data_by_country_level(self.df_filtered, user_input, country='US', course_level='Undergraduate')
        df_filtered = filter_by_scores_gpa_budget(df_filtered, user_input)
        recommendations = recommend(df_filtered, user_vec)
        self.assertTrue(len(recommendations) > 0, "No recommendations returned after filtering.")

    def test_model_accuracy(self):
        from sklearn.model_selection import cross_val_score
        cv_scores = cross_val_score(self.model, self.df[self.feature_cols], self.df['universityRankingNum'], cv=5, scoring='neg_mean_squared_error')
        cv_rmse = np.sqrt(-cv_scores.mean())
        print(f"Cross-validation RMSE: {cv_rmse:.2f}")
        self.assertTrue(cv_rmse < 1.5, f"RMSE is too high: {cv_rmse:.2f} (expected < 1.5 for scaled rankings)")

if __name__ == '__main__':
    unittest.main()