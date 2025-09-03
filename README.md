# UNIFINDER AI

## Description
AI module for UNIFINDER, a web app assisting Nepalese students in finding study-abroad universities. Implements recommendation engines using XGBoost (R²=0.93, RMSE=0.23) for international students and Gradient Boosting (R²=0.86, RMSE=0.27) for Nepalese students, integrated with Flask for backend serving.

## Features
- AI-based university matching based on academic inputs.
- Two models: XGBoost for international students, Gradient Boosting for Nepalese.
- Data preprocessing with Pandas and Scikit-learn.
- Model training and evaluation with cross-validation.
- Model saving and loading with Joblib.

## Technologies
- Python: Core language.
- Flask: Web server for AI API.
- XGBoost: Machine learning library for international model.
- Scikit-learn: Data processing and Gradient Boosting.
- Pandas: Data manipulation.
- Joblib: Model persistence.
- NumPy: Numerical operations.

## Installation
1. Clone repository.
2. Navigate to AI directory: `cd ai`.
3. Install dependencies: `pip install -r requirements.txt`.
4. Set environment variables (e.g., Flask port).
5. Run: `python app.py`.

## Usage
- Connects to backend for API calls.
- Accepts academic data (GPA, scores, preferences) for predictions.
- Returns university recommendations.

## License
Academic project; no specific license.
