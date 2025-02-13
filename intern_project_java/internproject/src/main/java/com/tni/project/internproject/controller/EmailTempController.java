package com.tni.project.internproject.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.tni.project.internproject.model.User;
import com.tni.project.internproject.service.EmailService;

public class EmailTempController {

	private EmailService emailService;
	
	public EmailTempController() {
		this.emailService = new EmailService();
	}
	

	public void sendEmail(User user) {
		
		// call Service email controller
		emailService.sendEmail(user);
		System.out.println("User = " + user.getUserID() + " : " +  user.getUserName());
		
	}
}
