package com.tni.project.internproject.model;

import java.sql.Date;

import org.springframework.stereotype.Component;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Component
@Table(name = "jp_companies")
public class CompanyJP extends Company {
	
	private String market;
	private double firstOpen;
	private double lastWeekClose;
	private double lastWeekReturnRate;
	
	
	
	public CompanyJP() {
		super();
	}

	public CompanyJP(String name, String symbol, Date offerDate, double offerPrice, double returnRate,
			String compLink, Industry industry,String market, double firstOpen, double lastWeekClose, double lastWeekReturnRate) {
		
		super(name,symbol,offerDate,offerPrice,returnRate,compLink, industry);
		this.market = market;
		this.firstOpen = firstOpen;
		this.lastWeekClose = lastWeekClose;
		this.lastWeekReturnRate = lastWeekReturnRate;
	}

	public String getMarket() {
		return market;
	}

	public void setMarket(String market) {
		this.market = market;
	}

	public double getFirstOpen() {
		return firstOpen;
	}

	public void setFirstOpen(double firstOpen) {
		this.firstOpen = firstOpen;
	}

	public double getLastWeekClose() {
		return lastWeekClose;
	}

	public void setLastWeekClose(double lastWeekClose) {
		this.lastWeekClose = lastWeekClose;
	}

	public double getLastWeekReturnRate() {
		return lastWeekReturnRate;
	}

	public void setLastWeekReturnRate(double lastWeekReturnRate) {
		this.lastWeekReturnRate = lastWeekReturnRate;
	}
	
	
	

}
