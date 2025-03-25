
import pandas as pd
import yfinance as yf
from fastapi import FastAPI, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
import json
import os
import requests

# Call USD to JPY (for Yen conversion rate)
def get_yen_to_usd_rate():
    try:
        # Fetching exchange rate for Yen to USD (JPY=X)
        stock = yf.Ticker("JPY=X")
        info = stock.info
        usd_rate = info.get("regularMarketPrice")
        if usd_rate:
            return usd_rate
        else:
            return None
    except Exception as e:
        return None

# Remove proxy settings (if they exist)
os.environ.pop("HTTP_PROXY", None)
os.environ.pop("HTTPS_PROXY", None)

# Make the request without a proxy
session = requests.Session()
session.trust_env = False  # Prevents requests from using environment proxies

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
    grossProfits: Optional[float]
    operatingExpense: Optional[float]
    operatingIncome: Optional[float]
    netIncome: Optional[float]
    netIncomeMargin: Optional[float]

    inventory: Optional[float]
    totalAssets: Optional[float]
    totalLiabilities: Optional[float]
    stakeholdersEquity: Optional[float]
    debToEquity: Optional[float]

    operatingCashflow: Optional[float]
    financingCashflow: Optional[float]
    investingCashflow: Optional[float]
    freeCashflow: Optional[float]

    sector: str
    industry: str
    ceo_name: str
    ceo_title: str
    yen_to_usd_rate: Optional[float]  # Add Yen to USD rate here
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
    grossProfits = info.get('grossProfits')
    operatingExpense = incomestmt.loc["Operating Expense"].iloc[0] if "Operating Expense" in incomestmt.index else None
    operatingIncome = incomestmt.loc["Operating Income"].iloc[0] if "Operating Income" in incomestmt.index else None
    netIncome = incomestmt.loc["Net Income"].iloc[0] if "Net Income" in incomestmt.index else None
    netIncomeMargin = (netIncome / revenue) * 100

    
    # Data from Balance sheet
    inventory = balancesheet.loc["Inventory"].iloc[0] if "Inventory" in balancesheet.index else None
    totalAssets = balancesheet.loc["Total Assets"].iloc[0] if "Total Assets" in balancesheet.index else None
    totalLiabilities = balancesheet.loc["Total Liabilities Net Minority Interest"].iloc[0] if "Total Liabilities Net Minority Interest" in balancesheet.index else None
    stakeholdersEquity = balancesheet.loc["Stockholders Equity"].iloc[0] if "Stockholders Equity" in balancesheet.index else None
    debToEquity = totalLiabilities / stakeholdersEquity
    
    # Data from cashflow
    operatingCashflow = info.get('operatingCashflow')
    financingCashflow = cashflow.loc["Financing Cash Flow"].iloc[0] if "Financing Cash Flow" in cashflow.index else None
    investingCashflow = cashflow.loc["Investing Cash Flow"].iloc[0] if "Investing Cash Flow" in cashflow.index else None
    freeCashflow = info.get('freeCashflow')

    # Get Yen to USD rate
    yen_to_usd_rate = get_yen_to_usd_rate()

    # If the ticker contains ".", perform Yen to USD conversion
    if "." in ticker and yen_to_usd_rate:
        # Convert all float values from Yen to USD by dividing by yen_to_usd_rate
        if marketcap:
            marketcap = marketcap / yen_to_usd_rate
        if revenue:
            revenue = revenue / yen_to_usd_rate
        if enterprisevalue:
            enterprisevalue = enterprisevalue / yen_to_usd_rate
        if priceEpsCurrentYear:
            priceEpsCurrentYear = priceEpsCurrentYear / yen_to_usd_rate
        if operatingExpense:
            operatingExpense = operatingExpense / yen_to_usd_rate
        if operatingIncome:
            operatingIncome = operatingIncome / yen_to_usd_rate
        if grossProfits:
            grossProfits = grossProfits / yen_to_usd_rate
        if inventory:
            inventory = inventory / yen_to_usd_rate
        if stakeholdersEquity:
            stakeholdersEquity = stakeholdersEquity / yen_to_usd_rate
        if operatingCashflow:
            operatingCashflow = operatingCashflow / yen_to_usd_rate
        if financingCashflow:
            financingCashflow = financingCashflow / yen_to_usd_rate
        if investingCashflow:
            investingCashflow = investingCashflow / yen_to_usd_rate
        if freeCashflow:
            freeCashflow = freeCashflow / yen_to_usd_rate

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
        "grossProfits": grossProfits,
        "operatingExpense": operatingExpense,
        "operatingIncome": operatingIncome,
        "netIncome": netIncome,
        "netIncomeMargin": netIncomeMargin,

        "inventory": inventory,
        "totalAssets": totalAssets,
        "totalLiabilities": totalLiabilities,
        "stakeholdersEquity": stakeholdersEquity,
        "debToEquity": debToEquity,

        "operatingCashflow": operatingCashflow,
        "financingCashflow": financingCashflow,
        "investingCashflow": investingCashflow,
        "freeCashflow": freeCashflow,

        "yen_to_usd_rate": yen_to_usd_rate,  # Include Yen to USD rate
        "extracted_at": current_timestamp
    }
    
    try:
        with open("stock_data.json", "r") as json_file:
            existing_data = json.load(json_file)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_data = {}


    existing_data[ticker] = stock_data


    if len(existing_data) > 2:
        existing_data.clear()


    with open("stock_data.json", "w") as json_file:
        json.dump(existing_data, json_file, indent=4)

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

# @app.get("/stockHistory/{ticker}")
# async def get_stock_history(ticker: str, period: str = Query("6mo", enum=["7d", "1mo", "6mo"])):  # Set default to "6mo"
#     try:
#         # Use the period parameter for the history method
#         stock = yf.Ticker(ticker)
#         history = stock.history(period=period)  # Get data based on the selected period

#         if history.empty:
#             return {"error": "No data found for this ticker"}

#         # Extract relevant data (date and closing price)
#         stock_data = [
#             {"date": str(date.date()), "close": round(row["Close"], 2)}
#             for date, row in history.iterrows()
#         ]

#         return stock_data
    
#         # Format the dates based on the selected period
#         formatted_data = [
#             {"date": date.strftime("%Y/%m/%d"), "close": round(row["Close"], 2)}
#             for date, row in history.iterrows()
#         ]
        
#         return formatted_data

#     except Exception as e:
#         return {"error": str(e)}

@app.get("/stockHistory/{ticker}")
async def get_stock_history(ticker: str, period: str = Query("6mo", enum=["7d", "1mo", "6mo"])):
    try:
        stock = yf.Ticker(ticker)

        # Fetch a longer period to ensure enough data for both 20-day and 50-day SMAs
        if period == "7d":
            extended_period = "3mo"  # To cover enough data for SMA calculations
        elif period == "1mo":
            extended_period = "4mo"  # Fetch more data to ensure SMA calculations
        else:  # For 6mo, fetch at least 8 months
            extended_period = "9mo"

        # Fetch historical data with the extended period
        history = stock.history(period=extended_period)

        if history.empty:
            return {"error": "No data found for this ticker"}

        # Calculate the 20-day and 50-day Simple Moving Averages (SMA)
        history["SMA_10"] = history["Close"].rolling(window=10).mean()
        history["SMA_20"] = history["Close"].rolling(window=20).mean()

        # Ensure we have enough data for the requested period (cut extra data)
        if period == "7d":
            history = history.iloc[-7:]  # Keep only the last 7 days
        elif period == "1mo":
            history = history.iloc[-20:]  # Keep only the last 1 month (20 days)
        elif period == "6mo":
            history = history.iloc[-120:]  # Keep only the last 6 months (120 days)

        # Extract relevant data (date, closing price, and both SMAs)
        stock_data = [
            {
                "date": str(date.date()), 
                "close": round(row["Close"], 2),
                "sma_10": None if pd.isna(row["SMA_10"]) else round(row["SMA_10"], 2),
                "sma_20": None if pd.isna(row["SMA_20"]) else round(row["SMA_20"], 2)
            }
            for date, row in history.iterrows()
        ]

        return stock_data

    except Exception as e:
        return {"error": str(e)}
