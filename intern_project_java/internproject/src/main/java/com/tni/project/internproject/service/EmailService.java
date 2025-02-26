package com.tni.project.internproject.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.annotation.ElementType;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.controller.EmailController;
import com.tni.project.internproject.model.Company;
import com.tni.project.internproject.model.User;
import com.tni.project.internproject.repo.CompanyRepo;
import com.tni.project.internproject.repo.EmailRepo;
import com.tni.project.internproject.repo.IndustryRepo;
import com.tni.project.internproject.repo.UserIndustryRepo;
import com.tni.project.internproject.repo.UserRepo;

import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.Table;

@Service
@Scope("prototype")
public class EmailService {

	@Autowired
	UserIndustryRepo userIndustryRepo;
	@Autowired
	IndustryRepo industryRepo;
	@Autowired
	UserRepo userRepo;
	@Autowired
	CompanyRepo compRepo;
	@Autowired
	private JavaMailSender mailSender;
	
	DateFormat dateFrm = new SimpleDateFormat("yyyy/M/d");

	public void sendEmail(int userID) {
		// Query a user
		User user = userRepo.findById(userID).orElse(null);
		// 1. Get a user's industry list
		// 1.1 call userIndustry repo for the list
		List<Integer> industryList = userIndustryRepo.findByUserID(user.getUserID()).orElse(null); 
																				
		// 2 Write an email [to be refined]
		// 2.1 return a industry list of the user (temp)
		System.out.println("List for" + user.getUserName() + ": " + industryList);

		// 2.2 Pull info from DB (Web scrape would be inefficient with many users)
		// 2.3 Call a method in this class to write an email, a normal one
		String emailContent =  writeMail(user);

		// 3. Call a method to append an email, industry-specific
		if(industryList.size() > 0) {
			emailContent = appendIndustry(industryList, userID, emailContent);
			System.out.println("Append for " + userID);
		}

		// 4. Send an email
		try {
		
			
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, false);
			helper.setFrom("bank200074@gmail.com");
			helper.setTo(user.getUserEmail());
			helper.setSubject("IPO Companies Update: " + Instant.now());

//			try (var inputStream = Objects.requireNonNull(
//					EmailService.class.getResourceAsStream("/templates/output_" + user.getUserID() + ".html"))) {
//				helper.setText(new String(inputStream.readAllBytes(), StandardCharsets.UTF_8), true);
//			} catch (Exception e) {
//				System.out.println(e.getMessage());
//			}
			
			helper.setText(emailContent, true);

			mailSender.send(message);
			System.out.println("SENT");

		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

	}

	private String appendIndustry(List<Integer> industryList, int userID, String emailContent) {
		//File input = new File("src/main/resources/templates/output_" + userID + ".html");
		Document doc = Jsoup.parseBodyFragment(emailContent);
		String htmlContent = "";
	
			for (int industry : industryList) {
				
				System.out.println("Funny for userID"+ userID);
				// Header
				Element lastTable = doc.select("table").last();
				Element title = doc.createElement("div")
						.addClass("title");
				title.appendElement("h2").append("Top Industries in: " + industryRepo.findById(industry).orElse(null).getIndustryName());
						
				lastTable.after(title);
				
				Element newTable = doc.createElement("table");
				newTable.attr("style"," border-collapse: collapse;\r\n"
						+ "        margin-top: 1rem;\r\n"
						+ "        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;\r\n"
						+ "        width: 100%;");
				
				Element headTag = doc.createElement("thead");
				Element headerRow = doc.createElement("tr");
				headerRow.attr("style"," background-color: #2e3e8b;\r\n"
						+ "            border-bottom: 1px solid #dddddd;\r\n"
						+ "            color: white;");
				
				headerRow.addClass("tableHeader");
				headerRow.appendElement("th").attr("style", "width: 40%; padding: 0.7rem").text("Company");
				headerRow.appendElement("th").text("Symbol");
				headerRow.appendElement("th").text("Industry");
				headerRow.appendElement("th").text("Offer Date");
				headerRow.appendElement("th").text("Shares (Millions)");
				headerRow.appendElement("th").text("Offer Price");
				headerRow.appendElement("th").text("1st Day Close");
				headerRow.appendElement("th").text("Current Price");
				headerRow.appendElement("th").text("Return");
				
				headTag.appendChild(headerRow);
				newTable.appendChild(headTag);
				doc.select("div.title").last().after(newTable);
				
				
				// Body
				List<Company> companies = compRepo.fetchTopIndustry(industry); 
				
				appendRow(doc, newTable, companies);
				
				
			}
			htmlContent = doc.html();
	
	
		return htmlContent;
		
		
	}

	public String writeMail(User user) {
		File input = new File("src/main/resources/templates/template.html");
		String htmlContent = "";
		try {
			Document doc = Jsoup.parse(input, "UTF-8");

			Element div = doc.select("div").first();
			div.text("Hello " + user.getUserName() + "!");
			
			List<Company> companies = compRepo.fetchLastWeek(); 
			
			Element mainTable = doc.selectFirst("table");
			
			appendRow(doc, mainTable, companies);

			htmlContent = doc.html();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return htmlContent;
	}

	// called directly from Postman
	public void testWriteMail(String name) {
	
		File input = new File("../internproject/src/main/resources/templates/template.html");
		try {
			Document doc = Jsoup.parse(input, "UTF-8");

			Element div = doc.select("div").first();
			div.text("Hello " + name + "!");
			
			List<Company> companies = compRepo.fetchLastWeek(); 
			
			Element mainTable = doc.selectFirst("table");
			
			appendRow(doc, mainTable, companies);
	
			// Outputting
			File output = new File("../internproject/src/main/resources/templates/output_" + 2 + ".html");
			output.createNewFile();
			PrintWriter writer = new PrintWriter(output, "UTF-8");
			writer.write(doc.html());
			writer.flush();
			writer.close();
			
			
			List<Integer> industryList = Arrays.asList(5,2,6);
			// doesn't actually use
//			if(industryList.size() != 0) {
//				appendIndustry(industryList, 2);
//			}
			

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace(); 
		}
	}
	
	public void appendRow(Document doc, Element anchor, List<Company> companies) {
		for (Company company : companies) {
			Element newRow = doc.createElement("tr");
			newRow.addClass("tableBody");
//			newRow.attr("background-color", "#ececec")
//				.attr("border-bottom", "1px solid #dddddd");
			newRow.attr("style","background-color: #ececec;border-bottom:1px solid #dddddd");

			newRow.appendElement("td").attr("style", "width: 40%; padding: 0.2rem").appendElement("b").text(company.getName());
			newRow.appendElement("td").text(company.getSymbol());
			newRow.appendElement("td").text(company.getIndustry().getIndustryName());
			newRow.appendElement("td").text(dateFrm.format(company.getOfferDate()));
			newRow.appendElement("td").text(company.getShares() + "");
			newRow.appendElement("td").text("$" + company.getOfferPrice());
			newRow.appendElement("td").text("$" + company.getFirstClose());
			newRow.appendElement("td").text("$" +company.getCurrentPrice());
			newRow.appendElement("td").text(company.getReturnRate() + "%");
			

			anchor.appendChild(newRow);

		}
	}

}
