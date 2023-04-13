import pandas as pd
from prophet import Prophet
from prophet.diagnostics import performance_metrics
from prophet.diagnostics import cross_validation
import numpy as np

def forecast(df,period,selectedProduct):
    df = df.sort_values('date')
    df.reset_index(drop=True,inplace=True)
    df = df.iloc[:,[0,int(selectedProduct)]]
    df = df.rename(columns={'date': 'ds'})
    df['ds'] = pd.to_datetime(df['ds'])
    df.columns=['ds','y']
    model= Prophet()
    model.fit(df)
    future_dates=model.make_future_dataframe(periods=period)
    prediction =model.predict(future_dates)
    prediction=prediction.iloc[:,[0,15]].tail(period)
    final_df=df.merge(prediction,on='ds',how='left')
    final_df = final_df.append(prediction, ignore_index=True)
    # print(final_df)
    cv = cross_validation(model,initial=f'100 days', period=f'25 days', horizon=f'50 days')
    df_p = performance_metrics(cv)
    
    # print(df_p)
    
    rmse = np.round(df_p['rmse'].values[0], 2)
    mse = np.round(df_p['mse'].values[0], 2)
    mae = np.round(df_p['mae'].values[0], 2)
    mape = np.round(df_p['mape'].values[0], 2)
    
    
    metrics = [rmse,mse,mae,mape]
    print(metrics)
    return(final_df)