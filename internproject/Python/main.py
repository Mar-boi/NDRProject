import yfinance as yf
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
import json
import requests  # Import requests to handle session and headers

app = FastAPI()

origins = [
    "http://localhost:5173",  # Your React front-end URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockDataResponse(BaseModel):
    ticker: str
    marketcap: Optional[float]
    enterprisevalue: Optional[float]
    revenue: Optional[float]
    grossProfit: Optional[float]
    sector: str
    industry: str
    ceo_name: str
    ceo_title: str
    extracted_at: str

# Setting up the custom User-Agent header for requests
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0'
}

# Creating a session to manage multiple requests
session = requests.Session()
session.headers.update(headers)

def get_stock_data(ticker: str):
    # Use Yahoo Finance API to get the data with requests session and headers
    stock = yf.Ticker(ticker)
    info = stock.info
    
    # Current timestamp for extraction time
    current_timestamp = datetime.now().strftime("%Y-%m-%d")
    
    # Extract the CEO data
    company_officers = info.get("companyOfficers", [])
    ceo_name = None
    ceo_title = None
    
    for officer in company_officers:
        if "CEO" in officer.get("title", "").upper():
            ceo_name = officer.get("name")
            ceo_title = officer.get("title")
            break

    # Extract other stock data
    marketcap = info.get('marketCap')
    enterprisevalue = info.get('enterpriseValue')
    revenue = info.get('totalRevenue')
    grossprofit = info.get('grossProfits')

    # Prepare the stock data dictionary
    stock_data = {
        "ticker": ticker,
        "marketcap": marketcap,
        "enterprisevalue": enterprisevalue,
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "ceo_name": ceo_name,
        "ceo_title": ceo_title,
        "revenue": revenue,
        "grossprofit": grossprofit,
        "extracted_at": current_timestamp
    }

    # Save the stock data to a JSON file
    with open("stock_data.json", "w") as json_file:
        json.dump(stock_data, json_file)
    
    return stock_data

@app.get("/get_stock_data/{ticker}", response_model=StockDataResponse)
async def get_stock_data_endpoint(ticker: str):
    stock_data = get_stock_data(ticker)
    return stock_data
