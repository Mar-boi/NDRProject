package com.tni.project.internproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.tni.project.internproject.model.User;
import com.tni.project.internproject.service.EmailService;

@Controller
public class EmailController {
	
	@Autowired
	private EmailService emailService;
	

	public void sendEmail(User user) {
		
		// call Service email controller
		emailService.sendEmail(user);
		
	}
}
