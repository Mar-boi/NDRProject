package com.tni.project.internproject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.model.User;
import com.tni.project.internproject.repo.IndustryRepo;
import com.tni.project.internproject.repo.UserIndustryRepo;


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
		// 2.2 Call a method in this class to write an email, a normal one
		// 2.3 Call a method in this class to write an email, industry specific
		// 2.4 Send an email
		
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom("bank200074@gmail.com");
			message.setTo(user.getUserEmail());
			message.setSubject("Simplet Text Email");
			message.setText("Hello " + user.getUserName() +"! This is a sample email body" + 
			"\nYour followed industries are " + industryList);
			
			mailSender.send(message);
			System.out.println("SENT");
			
		} catch (Exception e) {
		
		}
		
	}
	

}
