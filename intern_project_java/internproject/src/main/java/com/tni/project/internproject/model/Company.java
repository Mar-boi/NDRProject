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
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@MappedSuperclass
public abstract class Company {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int compID;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String symbol;
	@Column(nullable = false)
	private Date offerDate;
	private double offerPrice;
	private double returnRate;
	private String compLink;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "industryID")
	private Industry industry;
	
	public Company () {
		
	}
	
	public Company(String name, String symbol, Date offerDate, double offerPrice, double returnRate,
			String compLink, Industry industry) {
		super();

		this.name = name;
		this.symbol = symbol;
		this.offerDate = offerDate;
		this.offerPrice = offerPrice;
		this.returnRate = returnRate;
		this.compLink = compLink;
		this.industry = industry;
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

	public Date getOfferDate() {
		return offerDate;
	}

	public void setOfferDate(Date offerDate) {
		this.offerDate = offerDate;
	}

	public double getOfferPrice() {
		return offerPrice;
	}

	public void setOfferPrice(double offerPrice) {
		this.offerPrice = offerPrice;
	}

	public double getReturnRate() {
		return returnRate;
	}

	public void setReturnRate(double returnRate) {
		this.returnRate = returnRate;
	}

	public String getCompLink() {
		return compLink;
	}

	public void setCompLink(String compLink) {
		this.compLink = compLink;
	}

	public Industry getIndustry() {
		return industry;
	}

	public void setIndustry(Industry industry) {
		this.industry = industry;
	}

	
	
}
