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
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model for response validation
class StockDataResponse(BaseModel):
    ticker: str
    marketcap: Optional[float]  # Use Optional for fields that can be None
    enterprisevalue: Optional[float]  # Use Optional for fields that can be None
    revenue: Optional[float]
    operatingExpenses: Optional[float]
    operatingIncome: Optional[float]
    sector: str
    industry: str
    ceo_name: str
    ceo_title: str
    extracted_at: str

# User Agent
# Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36

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
        if "CEO" in officer.get("title", "").upper():  # Check if 'CEO' is in the title
            ceo_name = officer.get("name")
            ceo_title = officer.get("title")
            break  # Exit the loop once the CEO is found

    # Fetch market cap and enterprise value directly from the 'info' dictionary
    marketcap = info.get('marketCap')
    enterprisevalue = info.get('enterpriseValue')
    revenue = incomestmt.get('Total Revenue')
    operatingExpenses = incomestmt.get('Operating Expense')
    operatingIncome = incomestmt.get('Operating Expense')
    grossProfit = incomestmt.get('Gross Profit')

    # Handle cases where data might be missing
    if marketcap is None:
        marketcap = None  # You can also set a default value like 0
    if enterprisevalue is None:
        enterprisevalue = None  # Or set a default value like 0

    # Prepare the stock data response
    stock_data = {
        "ticker": ticker,
        "marketcap": marketcap,
        "enterprisevalue": enterprisevalue,
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "ceo_name": ceo_name,
        "ceo_title": ceo_title,
        "revenue": revenue,
        "operatingExpenses": operatingExpenses,
        "operatingIncome": operatingIncome,
        "grossProfit": grossProfit,
        "extracted_at": current_timestamp
    }
    with open("stock_data.json", "w") as json_file:
        json.dump(stock_data, json_file)
    return stock_data

@app.get("/get_stock_data/{ticker}", response_model=StockDataResponse)
async def get_stock_data_endpoint(ticker: str):
    stock_data = get_stock_data(ticker)
    return stock_data