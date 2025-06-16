import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb  # Import XGBoost
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.metrics import r2_score
# Load processed data
df = pd.read_csv('../data/processed/ml_ready_data.csv')

# Check and handle infinite values only in numeric columns
numeric_df = df.select_dtypes(include=[np.number])
if np.any(np.isinf(numeric_df.to_numpy())):
    print("⚠️ Warning: The data contains infinite values.")
    df = df.replace([np.inf, -np.inf], np.nan).dropna()

# Drop non-feature columns: target and uniqueID
X = df.drop(columns=['universityRankingNum', 'uniqueID'])
y = df['universityRankingNum']

# Step 1: Cross-validation to get more reliable performance estimate (10-fold CV)
cv_scores = cross_val_score(RandomForestRegressor(n_estimators=100, random_state=42), X, y, cv=10, scoring='neg_mean_squared_error')
cv_rmse = np.sqrt(-cv_scores.mean())  # Convert negative MSE to RMSE
print(f"✅ Cross-validated RMSE: {cv_rmse:.2f}")

# Step 2: Hyperparameter Tuning with GridSearchCV (Wider Search)
param_grid = {
    'n_estimators': [100, 200, 300, 400],        # Number of trees
    'max_depth': [None, 10, 20, 30, 40],         # Maximum depth of trees
    'min_samples_split': [2, 5, 10],             # Minimum samples to split a node
    'min_samples_leaf': [1, 2, 4],               # Minimum samples per leaf
}

# Initialize RandomForestRegressor for GridSearchCV
model = RandomForestRegressor(random_state=42)

# Perform GridSearchCV with 10-fold cross-validation
grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=10, scoring='neg_mean_squared_error', n_jobs=-1)
grid_search.fit(X, y)

# Best parameters from GridSearchCV
print(f"Best parameters from GridSearchCV: {grid_search.best_params_}")

# Train the model with the best parameters
best_model = grid_search.best_estimator_

# Step 3: Train-test split for final model evaluation
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit the best model on the training data
best_model.fit(X_train, y_train)

# Predict on the test set
y_pred = best_model.predict(X_test)

# Evaluate model performance
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"✅ Test RMSE: {rmse:.2f}")

# Save the best model to a file
joblib.dump(best_model, '../models/random_forest_model_best_ml_data7.joblib')
print("✅ Best model saved to '../models/random_forest_model_best.joblib'")

# Step 4: Try XGBoost model for comparison
xgb_model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)

# Hyperparameter tuning for XGBoost (using GridSearchCV)
xgb_param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 6, 9],
    'learning_rate': [0.01, 0.1, 0.2],
    'subsample': [0.8, 0.9, 1.0]
}

# Perform GridSearchCV for XGBoost
xgb_grid_search = GridSearchCV(estimator=xgb_model, param_grid=xgb_param_grid, cv=10, scoring='neg_mean_squared_error', n_jobs=-1)
xgb_grid_search.fit(X, y)

# Best parameters for XGBoost
print(f"Best parameters from XGBoost GridSearchCV: {xgb_grid_search.best_params_}")

# Train the best XGBoost model
best_xgb_model = xgb_grid_search.best_estimator_

# Predict on the test set using XGBoost
xgb_y_pred = best_xgb_model.predict(X_test)

# Evaluate XGBoost model performance
xgb_rmse = np.sqrt(mean_squared_error(y_test, xgb_y_pred))
print(f"✅ XGBoost Test RMSE: {xgb_rmse:.2f}")

xgb_r2 = r2_score(y_test, xgb_y_pred)
print(f"✅ XGBoost R²: {xgb_r2:.2f}")

# Save the best XGBoost model
joblib.dump(best_xgb_model, '../models/xgboost_model_best11.joblib')
print("✅ Best XGBoost model saved to '../models/xgboost_model_best11.joblib'")