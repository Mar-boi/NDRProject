package com.tni.project.internproject.service;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.annotation.ElementType;
import java.nio.charset.StandardCharsets;
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
import com.tni.project.internproject.model.User;
import com.tni.project.internproject.repo.IndustryRepo;
import com.tni.project.internproject.repo.UserIndustryRepo;

import jakarta.mail.internet.MimeMessage;
import lombok.experimental.var;


@Service
@Scope("prototype")
public class EmailService {
	
	@Autowired
	UserIndustryRepo userIndustryRepo;
	@Autowired
	IndustryRepo industryRepo;
	@Autowired
	private JavaMailSender mailSender;


	public void sendEmail(User user) {
		// 1. Get a user's industry list
		// 1.1 call userIndustry repo for the list
		List<String> industryList = userIndustryRepo.findByUserID(user.getUserID()); // Should actually be int type(?)
		
		
		
		// 2 Write an email [to be refined]
		// 2.05 return a industry list of the user (temp)
		System.out.println("List for" + user.getUserName() + ": " + industryList );
		
		// 2.1 Scrap the website by calling a loadInfo from CompanyService
		// Put it in some kinda of data (List<Company>)
		// 2.1.5 Filter a new one by using lambda expression?
		// 2.2 Call a method in this class to write an email, a normal one
		modifyMail(user);
		
		// 2.3 Call a method in this class to append an email, industry specific		
		// Probably need to use JSoup along with file editor because that is so sad TT
	
		
		
		
		
		// 2.4 Send an email
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, false);
			helper.setFrom("bank200074@gmail.com");
			helper.setTo(user.getUserEmail());
			helper.setSubject("Simplet Text Email");
			//message.setText("Hello " + user.getUserName() +"! This is a sample email body" + 
			//"\nYour followed industries are " + industryList);
			
			try(var inputStream = Objects.requireNonNull( EmailController.class.getResourceAsStream("/templates/output_" + user.getUserID()+".html"))) 
			{
				helper.setText(
						new String(inputStream.readAllBytes(),StandardCharsets.UTF_8),
						true
					);
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
				
			mailSender.send(message);
			System.out.println("SENT");
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		
	}
	
	public void modifyMail(User user) {
		File input = new File("../internproject/src/main/resources/templates/template.html");
		try {
			Document doc = Jsoup.parse(input, "UTF-8");
			
			Element div = doc.select("div").first();
			div.text("Hello " + user.getUserName() + "!");
			
			File output = new File("../internproject/src/main/resources/templates/output_" + user.getUserID() + ".html");
			output.createNewFile();
			PrintWriter writer = new PrintWriter(output,"UTF-8");
			writer.write(doc.html());
			writer.close();
	
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	

}
