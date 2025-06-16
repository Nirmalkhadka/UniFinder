import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
import xgboost as xgb  # Import XGBoost
import lightgbm as lgb  # Import LightGBM
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.model_selection import cross_val_score

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

# Step 1: Cross-validation to get more reliable performance estimate (10-fold CV) for XGBoost
cv_scores_xgb = cross_val_score(xgb.XGBRegressor(objective='reg:squarederror', random_state=42), X, y, cv=5, scoring='neg_mean_squared_error')  # Use 5-fold CV for faster results
cv_rmse_xgb = np.sqrt(-cv_scores_xgb.mean())  # Convert negative MSE to RMSE
print(f"✅ XGBoost Cross-validated RMSE: {cv_rmse_xgb:.2f}")

# Step 1: Cross-validation to get more reliable performance estimate (10-fold CV) for LightGBM
cv_scores_lgb = cross_val_score(lgb.LGBMRegressor(objective='regression', random_state=42), X, y, cv=5, scoring='neg_mean_squared_error')  # Use 5-fold CV for faster results
cv_rmse_lgb = np.sqrt(-cv_scores_lgb.mean())  # Convert negative MSE to RMSE
print(f"✅ LightGBM Cross-validated RMSE: {cv_rmse_lgb:.2f}")

# Step 2: Hyperparameter Tuning with GridSearchCV for XGBoost (smaller search grid)
xgb_param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [3, 6],
    'learning_rate': [0.05, 0.1],
    'subsample': [0.8, 0.9],
}

# Perform GridSearchCV for XGBoost
xgb_grid_search = GridSearchCV(estimator=xgb.XGBRegressor(objective='reg:squarederror', random_state=42), param_grid=xgb_param_grid, cv=3, scoring='neg_mean_squared_error', n_jobs=-1)  # Use 3-fold CV
xgb_grid_search.fit(X, y)

# Best parameters for XGBoost
print(f"Best parameters from XGBoost GridSearchCV: {xgb_grid_search.best_params_}")

# Train the best XGBoost model
best_xgb_model = xgb_grid_search.best_estimator_

# Step 3: Hyperparameter Tuning with GridSearchCV for LightGBM (smaller search grid)
lgb_param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [3, 6],
    'learning_rate': [0.05, 0.1],
    'subsample': [0.8, 0.9],
    'num_leaves': [31, 50]  # Number of leaves in each tree for LightGBM
}

# Perform GridSearchCV for LightGBM
lgb_grid_search = GridSearchCV(estimator=lgb.LGBMRegressor(objective='regression', random_state=42), param_grid=lgb_param_grid, cv=3, scoring='neg_mean_squared_error', n_jobs=-1)  # Use 3-fold CV
lgb_grid_search.fit(X, y)

# Best parameters for LightGBM
print(f"Best parameters from LightGBM GridSearchCV: {lgb_grid_search.best_params_}")

# Train the best LightGBM model
best_lgb_model = lgb_grid_search.best_estimator_

# Step 4: Train-test split for final model evaluation
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit the best XGBoost model on the training data
best_xgb_model.fit(X_train, y_train)

# Predict on the test set using XGBoost
xgb_y_pred = best_xgb_model.predict(X_test)

# Evaluate XGBoost model performance
xgb_rmse = np.sqrt(mean_squared_error(y_test, xgb_y_pred))
print(f"✅ XGBoost Test RMSE: {xgb_rmse:.2f}")

# Fit the best LightGBM model on the training data
best_lgb_model.fit(X_train, y_train)

# Predict on the test set using LightGBM
lgb_y_pred = best_lgb_model.predict(X_test)

# Evaluate LightGBM model performance
lgb_rmse = np.sqrt(mean_squared_error(y_test, lgb_y_pred))
print(f"✅ LightGBM Test RMSE: {lgb_rmse:.2f}")

# Save the best XGBoost model
joblib.dump(best_xgb_model, '../models/xgboost_model_best69.joblib')
print("✅ Best XGBoost model saved to '../models/xgboost_model_best.joblib'")

# Save the best LightGBM model
joblib.dump(best_lgb_model, '../models/lightgbm_model_best69.joblib')
print("✅ Best LightGBM model saved to '../models/lightgbm_model_best.joblib'")