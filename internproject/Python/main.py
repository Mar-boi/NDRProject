import yfinance as yf
from fastapi import FastAPI, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
from typing import List
import json
import os
import requests

# Remove proxy settings (if they exist)
os.environ.pop("HTTP_PROXY", None)
os.environ.pop("HTTPS_PROXY", None)

# Make the request without a proxy
session = requests.Session()
session.trust_env = False  # Prevents requests from using environment proxies

response = session.get("https://query1.finance.yahoo.com/v1/test/getcrumb")

# Initialize FastAPI
app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    priceEpsCurrentYear: Optional[float]
    revenue: Optional[float]
    operatingExpense: Optional[float]  # Fix here (was: operateingExpenses)
    operatingIncome: Optional[float]
    grossProfits: Optional[float]
    inventory: Optional[float]
    equity: Optional[float]
    operatingCashflow: Optional[float]
    capitalExpenditure: Optional[float]
    investingCashflow: Optional[float]
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
    priceEpsCurrentYear = info.get('priceEpsCurrentYear', None)
    
    # Data from Incomestmt
    revenue = info.get('totalRevenue')
    operatingExpense = incomestmt.loc["Operating Expense"].iloc[0] if "Operating Expense" in incomestmt.index else None
    operatingIncome = incomestmt.loc["Operating Income"].iloc[0] if "Operating Income" in incomestmt.index else None
    grossProfits = info.get('grossProfits')
    
    # Data from Balance sheet
    inventory = balancesheet.loc["Inventory"].iloc[0] if "Inventory" in balancesheet.index else None
    equity = balancesheet.loc["Stockholders Equity"].iloc[0] if "Stockholders Equity" in balancesheet.index else None
    
    # Data from cashflow
    operatingCashflow = info.get('operatingCashflow')
    capitalExpenditure = cashflow.loc["Capital Expenditure"].iloc[0] if "Capital Expenditure" in cashflow.index else None
    investingCashflow = cashflow.loc["Investing Cash Flow"].iloc[0] if "Investing Cash Flow" in cashflow.index else None
    freeCashflow = info.get('freeCashflow')
    
    # Prepare the stock data response
    stock_data = {
        "longName": longName,
        "ticker": ticker,
        "marketcap": marketcap,
        "enterprisevalue": enterprisevalue,
        "priceEpsCurrentYear": priceEpsCurrentYear,
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "ceo_name": ceo_name,
        "ceo_title": ceo_title,
        "revenue": revenue,
        "operatingExpense": operatingExpense,
        "operatingIncome": operatingIncome,
        "grossProfits": grossProfits,
        "inventory": inventory,
        "equity": equity,
        "operatingCashflow": operatingCashflow,
        "capitalExpenditure": capitalExpenditure,
        "investingCashflow": investingCashflow,
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

# Function to format the date based on the selected period
def format_date_for_period(date, period):
    if period == "7d":
        return date.strftime("%m/%d")  # M/DD for 7 days
    elif period == "1mo":
        if date.day <= 3:
            return date.strftime("%b'%y")  # MMM'YY for the first few days of the month
        return date.strftime("%d")  # DD for the rest of the days in the month
    elif period == "6mo":
        if date.month == 1:
            return date.strftime("%Y")  # YYYY for January
        return date.strftime("%b")  # MMM for other months
    return date.strftime("%Y/%m/%d")  # Default format

@app.get("/stockHistory/{ticker}")
async def get_stock_history(ticker: str, period: str = Query("6mo", enum=["7d", "5d", "1mo", "6mo"])):  # Set default to "6mo"
    try:
        # Use the period parameter for the history method
        stock = yf.Ticker(ticker)
        history = stock.history(period=period)  # Get data based on the selected period

        if history.empty:
            return {"error": "No data found for this ticker"}

        # Extract relevant data (date and closing price)
        stock_data = [
            {"date": str(date.date()), "close": round(row["Close"], 2)}
            for date, row in history.iterrows()
        ]

        return stock_data
    
        # Format the dates based on the selected period
        formatted_data = [
            {"date": date.strftime("%Y/%m/%d"), "close": round(row["Close"], 2)}
            for date, row in history.iterrows()
        ]
        
        return formatted_data

    except Exception as e:
        return {"error": str(e)}

