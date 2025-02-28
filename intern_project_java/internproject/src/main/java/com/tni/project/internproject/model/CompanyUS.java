package com.tni.project.internproject.model;


import java.sql.Date;

import org.springframework.stereotype.Component;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Component
@Table(name = "us_companies")
public class CompanyUS extends Company{
	
	private double shares;
	private double firstClose;
	private double currentPrice;
	

	public CompanyUS() {

	}

	
	public CompanyUS(String name, String symbol, Date offerDate, double offerPrice, double returnRate,
			String compLink, Industry industry, double shares, double firstClose, double currentPrice) {
		super(name, symbol, offerDate, offerPrice, returnRate, compLink, industry);
		this.shares = shares;
		this.firstClose = firstClose;
		this.currentPrice = currentPrice;
	}


	public double getShares() {
		return shares;
	}


	public void setShares(double shares) {
		this.shares = shares;
	}


	public double getFirstClose() {
		return firstClose;
	}


	public void setFirstClose(double firstClose) {
		this.firstClose = firstClose;
	}


	public double getCurrentPrice() {
		return currentPrice;
	}


	public void setCurrentPrice(double currentPrice) {
		this.currentPrice = currentPrice;
	}
	
	

	
	


}
