package com.tni.project.internproject.model;

import java.sql.Date;

import org.springframework.stereotype.Component;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Component
public class Company {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int compID;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String symbol;
	@Column(nullable = false)
	private Date offerDate;
	private double shares;
	private double offerPrice;
	private double firstClose;
	private double currentPrice;
	private double returnRate;
	private String compLink;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "industryID")
	private Industry industry;
	
	public Company () {
		
	}

	public Company(String name, String symbol, Date offerDate, double shares, double offerPrice, double firstClose,
			double currentPrice, double returnRate, Industry industry, String compLink) {
		this.name = name;
		this.symbol = symbol;
		this.offerDate = offerDate;
		this.shares = shares;
		this.offerPrice = offerPrice;
		this.firstClose = firstClose;
		this.currentPrice = currentPrice;
		this.returnRate = returnRate;
		this.industry = industry;
		this.compLink = compLink;
	}
	
	public int getCompID() {
		return compID;
	}
	public void setCompID(int compID) {
		this.compID = compID;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSymbol() {
		return symbol;
	}
	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}
	public Industry getIndustry() {
		return industry;
	}
	public void setIndustry(Industry industry) {
		this.industry = industry;
	}
	public Date getOfferDate() {
		return offerDate;
	}
	public void setOfferDate(Date offerDate) {
		this.offerDate = offerDate;
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
	public double getReturnRate() {
		return returnRate;
	}
	public void setReturnRate(double returnRate) {
		this.returnRate = returnRate;
	}

	public double getOfferPrice() {
		return offerPrice;
	}
	public void setOfferPrice(double offerPrice) {
		this.offerPrice = offerPrice;
	}

	public String getCompLink() {
		return compLink;
	}

	public void setCompLink(String compLink) {
		this.compLink = compLink;
	}
	
	
	
	

}
