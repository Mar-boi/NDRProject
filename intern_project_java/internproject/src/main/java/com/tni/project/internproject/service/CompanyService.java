package com.tni.project.internproject.service;

import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.model.Company;
import com.tni.project.internproject.model.Industry;
import com.tni.project.internproject.repo.CompanyRepo;
import com.tni.project.internproject.repo.IndustryRepo;

@Service
public class CompanyService {
	@Autowired
	CompanyRepo compRepo;
	@Autowired
	IndustryRepo inRepo;

	private List<Company> newCompanies;
	private List<Company> companies;
	
	SimpleDateFormat dateFrm =  new SimpleDateFormat("M/d/yyyy");
	
	public List<Company> fetchAll() throws ParseException {
		
		// Use JSoup to scrape data
		
		Document doc;
		newCompanies = new ArrayList<Company>();

		try {
			
			doc = Jsoup.connect("https://www.iposcoop.com/last-100-ipos/").get();
			//System.out.println(doc.body());

			// initializing the list of Java object to store
			companies = new ArrayList<>();

			// retrieving the list of product HTML elements
			Elements productElements = doc.select("tr");

			// iterating over the list of HTML products
			for (Element productElement : productElements) {
			    // Extract the columns
			    Elements cells = productElement.select("td");
			    
			    // Check if there are at least a column in the row
			    if (cells.size() > 1) {
			        // Assign text content to respective variables based on their index
			        String name = cells.get(0).text();
			        String symbol = cells.get(1).text();
			        
			        Industry industry = inRepo.findByIndustryName(cells.get(2).text());
			        java.util.Date utilDate = dateFrm.parse(cells.get(3).text());
	
			        System.out.println(cells.get(3).text());
			        System.out.println(utilDate);
			        java.sql.Date offerDate = new java.sql.Date(utilDate.getTime());
			        
			        double shares = getNum(cells.get(4).text());  
			        double offerPrice = getNum(cells.get(5).text());
			        double firstClose = getNum(cells.get(6).text());
			        double currentPrice = getNum(cells.get(7).text());
			        double returnRate = getNum(cells.get(8).text());
			        
			        String compLink = productElement.select("a[href]").attr("href");
			        
			        //String textJson = ExampleUtils.toJson(company);
				    //products.add(textJson);
			        
			        Company company = new Company(name, symbol, offerDate, shares, offerPrice, firstClose, currentPrice, returnRate, industry, compLink);	
			        filterNewCompany(company);		        
			    }
			
			}

			// save to DB		
		    saveToDB();
		    
			// send as JSON to React
		    // The thing is I think this should be fetched from DB again so they have an ID right??
			return  fetchLast(100);

		} catch (IOException e) {
			return null;
		}	
	}
	
	
	// Dealing with text including special char and parse to double
	public double getNum(String text) {
		if(text.contains("$")) {
			return Double.parseDouble(text.substring(1));
		}
		if(text.contains("%")) {
			return Double.parseDouble(text.substring(0, text.length()-1));
		}
		return Double.parseDouble(text);
	}
	
	// add a new company to the list only
	public void filterNewCompany(Company company) {
		
		 Company tempComp = compRepo.findBySymbol(company.getSymbol()).orElse(null);
		    if(tempComp == null) {
		    	System.out.println("Doesnt exist");
		    	newCompanies.add(company);
		    } else {
		    	compRepo.update(company);
		    }
	}

	public void saveToDB() {
		System.out.println("Hi: " + newCompanies);

		compRepo.saveAll(newCompanies);
	}
	
	// fetch the last 100 companies
	public List<Company> fetchLast(int amount) {
		return compRepo.fetchLast(amount);
	}
	
	public List<Company> fetchLastWeek() {
		return compRepo.fetchLastWeek();
	}
}
