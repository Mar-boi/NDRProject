import yfinance as yf
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
import json

# Initialize FastAPI
app = FastAPI()

# Define CORS configuration
origins = [
    "http://localhost:5173",  # React frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for response validation
class StockDataResponse(BaseModel):
    ticker: str
    longName: str
    marketcap: Optional[float]
    enterprisevalue: Optional[float]
    revenue: Optional[float]
    grossProfits: Optional[float]
    operatingCashflow: Optional[float]
    freeCashflow: Optional[float]
    sector: str
    industry: str
    ceo_name: str
    ceo_title: str
    extracted_at: str

# Updated function to fetch stock data
def get_stock_data(ticker: str):
    stock = yf.Ticker(ticker)
    info = stock.info
    incomestmt = stock.quarterly_incomestmt
    balancesheet = stock.quarterly_balancesheet
    cashflow = stock.quarterly_cashflow
    
    current_timestamp = datetime.now().strftime("%Y-%m-%d")

    # Fetch company officers data
    company_officers = info.get("companyOfficers", [])

    # Initialize variables for CEO's name and title
    ceo_name = None
    ceo_title = None

    # Loop through company officers and find the CEO
    for officer in company_officers:
        if "CEO" in officer.get("title", "").upper():
            ceo_name = officer.get("name")
            ceo_title = officer.get("title")
            break

    # Fetch market cap and enterprise value directly from the 'info' dictionary
    longName = info.get('longName')
    marketcap = info.get('marketCap', None)
    enterprisevalue = info.get('enterpriseValue', None)
    revenue = info.get('totalRevenue')
    grossProfits = info.get('grossProfits')
    operatingCashflow = info.get('operatingCashflow')
    freeCashflow = info.get('freeCashflow')
    inventory = balancesheet.get("Inventory", 0)
    
    # Prepare the stock data response
    stock_data = {
        "longName": longName,
        "ticker": ticker,
        "marketcap": marketcap,
        "enterprisevalue": enterprisevalue,
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "ceo_name": ceo_name,
        "ceo_title": ceo_title,
        "revenue": revenue,
        "grossProfits": grossProfits,
        "operatingCashflow": operatingCashflow,
        "freeCashflow": freeCashflow,
        "inventory": inventory,
        "extracted_at": current_timestamp
    }
    
    with open("stock_data.json", "w") as json_file:
        json.dump(stock_data, json_file)
    
    return stock_data


@app.get("/get_stock_data/{ticker}", response_model=StockDataResponse)
async def get_stock_data_endpoint(ticker: str):
    stock_data = get_stock_data(ticker)
    return stock_data