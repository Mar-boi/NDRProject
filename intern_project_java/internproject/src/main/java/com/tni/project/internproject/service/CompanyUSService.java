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
import com.tni.project.internproject.model.CompanyUS;
import com.tni.project.internproject.model.Industry;
import com.tni.project.internproject.repo.CompanyUSRepo;
import com.tni.project.internproject.repo.IndustryRepo;
import com.tni.project.internproject.util.StringUtil;

import jakarta.transaction.Transactional;

@Service
public class CompanyUSService implements CompanyService<CompanyUS>{
	@Autowired
	CompanyUSRepo compRepo;
	@Autowired
	IndustryRepo inRepo;

	private List<CompanyUS> newCompanies;
	
	SimpleDateFormat dateFrm =  new SimpleDateFormat("M/d/yyyy");
	
	@Override
	public List<CompanyUS> fetchAll() {
		return fetchLast(100);
	}
	
	
	// add a new company to the list only
	@Override
	public void filterNewCompany(CompanyUS company) {
	    // Check if the company already exists by symbol
	    CompanyUS tempComp = compRepo.findBySymbol(company.getSymbol()).orElse(null);
	    
	    if (tempComp == null) {
	        System.out.println("Doesn't exist");
	        
	        newCompanies.add(company);
	    } else {
	        // Update existing company if needed
	        compRepo.update(company);
	    }
	}



	@Override
	@Transactional
	public void saveToDB() {
	    Document doc;
	    newCompanies = new ArrayList<CompanyUS>();

	    try {
	        doc = Jsoup.connect("https://www.iposcoop.com/last-100-ipos/").get();
	        
	        // retrieving the list of product HTML elements
	        Elements productElements = doc.select("tr");

	        // iterating over the list of HTML products
	        for (Element productElement : productElements) {
	            Elements cells = productElement.select("td");

	            if (cells.size() > 1) {
	                String name = cells.get(0).text();
	                String symbol = cells.get(1).text();
	                
	                // Fetch the industry using the industry name
	                Industry industry = inRepo.findByIndustryName(cells.get(2).text());
	               

	                java.util.Date utilDate = dateFrm.parse(cells.get(3).text());
	                java.sql.Date offerDate = new java.sql.Date(utilDate.getTime());

	                double shares = StringUtil.getNum(cells.get(4).text());
	                double offerPrice = StringUtil.getNum(cells.get(5).text());
	                double firstClose = StringUtil.getNum(cells.get(6).text());
	                double currentPrice = StringUtil.getNum(cells.get(7).text());
	                double returnRate = StringUtil.getNum(cells.get(8).text());

	                String compLink = productElement.select("a[href]").attr("href");

	                // Create the new CompanyUS entity with the attached Industry
	                CompanyUS company = new CompanyUS(name, symbol, offerDate, offerPrice, returnRate, compLink, industry, shares, firstClose, currentPrice);

	                // Filter new companies only
	                filterNewCompany(company);
	                
	                System.out.println(company);
	            }
	        }
	        compRepo.saveAll(newCompanies);
	    } catch (IOException | ParseException e) {
	        e.printStackTrace();
	    }
	}

	

	@Override
	public List<CompanyUS> fetchLast(int amount) {
		return compRepo.fetchLast(amount);
	}


	@Override
	public List<CompanyUS> fetchLastWeek() {
		return compRepo.fetchLastWeek();
	}


	


}
