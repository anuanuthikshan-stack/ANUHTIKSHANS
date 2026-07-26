import pandas as pd
import numpy as np

def create_time_series_features(df: pd.DataFrame, target_col: str = 'Total_Qty') -> pd.DataFrame:
    """
    Constructs Month_Num, Lag1, Lag2, Lag3, and 3-month Rolling_Mean features for ML model training.
    """
    feat_df = df.copy()
    feat_df = feat_df.sort_values(by='Month_Year').reset_index(drop=True)
    
    feat_df['Month_Num'] = range(1, len(feat_df) + 1)
    feat_df['Lag1'] = feat_df[target_col].shift(1)
    feat_df['Lag2'] = feat_df[target_col].shift(2)
    feat_df['Lag3'] = feat_df[target_col].shift(3)
    feat_df['Rolling_Mean'] = feat_df[target_col].rolling(window=3).mean()
    
    return feat_df.dropna().reset_index(drop=True)
