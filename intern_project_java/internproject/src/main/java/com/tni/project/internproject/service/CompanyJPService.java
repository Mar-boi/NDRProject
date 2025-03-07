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
import com.tni.project.internproject.model.CompanyJP;
import com.tni.project.internproject.model.CompanyUS;
import com.tni.project.internproject.model.Industry;
import com.tni.project.internproject.repo.CompanyJPRepo;
import com.tni.project.internproject.repo.CompanyUSRepo;
import com.tni.project.internproject.repo.IndustryRepo;
import com.tni.project.internproject.util.StringUtil;

import jakarta.transaction.Transactional;

@Service
public class CompanyJPService implements CompanyService<CompanyJP> {
	@Autowired
	CompanyJPRepo compRepo;
	@Autowired
	IndustryRepo inRepo;

	private List<CompanyJP> newCompanies;

	SimpleDateFormat dateFrm = new SimpleDateFormat("yyyy/MM/dd");

	@Override
	public List<CompanyJP> fetchAll() {
		return fetchLast(100);
	}

	// add a new company to the list only
	@Override
	public void filterNewCompany(CompanyJP company) {
		// Check if the company already exists by symbol
		CompanyJP tempComp = compRepo.findBySymbol(company.getSymbol()).orElse(null);

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
		newCompanies = new ArrayList<CompanyJP>();

		String fixedLink = "https://finance.matsui.co.jp";
		try {
			doc = Jsoup.connect("https://finance.matsui.co.jp/ipo/real-ipo/index?utf8=%E2%9C%93&page=1&per_page=100")
					.get();

			// retrieving the body (rows) of companies list
			Elements trs = doc.select("tbody > tr");
			System.out.println("tr" + trs);

			System.out.println("Size:" + trs.size());
			// iterating over the list of HTML products
			for (Element tr : trs) {

				if (tr != null) {
					Elements tds = tr.select("td");

					if (tds.size() > 7) {
						String market = tds.get(0).selectFirst("span") != null ? tds.get(0).selectFirst("span").text()
								: "N/A";

						// Extract Link
						Element aTag = tds.get(0).selectFirst("a");
						String link = (aTag != null) ? fixedLink + aTag.attr("href") : "N/A";

						// Extract Name
						String name = (aTag != null) ? aTag.ownText() : "N/A";

						// Extract Code
						Elements spans = tds.get(0).select("span");
						String code = spans.size() > 1 ? spans.last().text() : "N/A";

						java.util.Date utilDate = dateFrm.parse(tds.get(2).text());
						java.sql.Date offerDate = new java.sql.Date(utilDate.getTime());

						double offerPrice = StringUtil.getNum(tds.get(3).text());
						double openPrice = StringUtil.getNum(tds.get(4).text());
						double returnRate = StringUtil.getNum(tds.get(5).text());
						double weekClosePrice = StringUtil.getNum(tds.get(6).text());
						double weekReturnRate = StringUtil.getNum(tds.get(6).text());

						Industry industry = categorizeIndustry(link);

						CompanyJP company = new CompanyJP(name, code, offerDate, offerPrice, returnRate,  link, industry, market,openPrice, weekClosePrice, weekReturnRate);

						filterNewCompany(company);
					} else {
						System.out.println("Size to oomfie");
					}

				} else {
					System.out.println("No <tr> found inside <tbody>");
				}

			}
			compRepo.saveAll(newCompanies);

		} catch (IOException | ParseException e) {
			e.printStackTrace();
		}

	}

	private Industry categorizeIndustry(String link) {
		String industryString = "";
		Document doc;
		try {
			doc = Jsoup.connect(link).get();
			Element div = doc.getElementsByClass("l-subsection-sep").first();
			industryString = div.selectFirst("td").text();

			if (industryString == null) {
				return null;
			}
			
			if(industryString.equals("金属製品")) {
				industryString = "Basic Materials";
			} else if(industryString.equals("食料品")) {
				industryString = "Consumer Goods";
			} else if(industryString.equals("サービス業") || industryString.equals("卸売業") ) {
				industryString = "Consumer Services";
			} else if(industryString.equals("不動産業")) {
				industryString = "Financials";
			} else if(industryString.equals("医薬品")) {
				industryString = "Health Care";
			}  else if(industryString.equals("建設業") || industryString.equals("陸運業") ) {
				industryString = "Industrials";
			}  else if(industryString.equals("電気・ガス業")) {
				industryString = "Oil & Gas";
			} else if(industryString.equals("情報・通信業") || industryString.equals("電気機器") || industryString.equals("精密機器")) {
				industryString = "Technology";
			} else {
				industryString = "Other";
			}
			
			 Industry industry = inRepo.findByIndustryName(industryString);
			return industry;

		} catch (IOException e) {
			e.printStackTrace();
		}

		return null;
	
	}

	@Override
	public List<CompanyJP> fetchLast(int amount) {
		return compRepo.fetchLast(amount);
	}

	@Override
	public List<CompanyJP> fetchLastWeek() {
		return compRepo.fetchLastWeek();
	}

}
