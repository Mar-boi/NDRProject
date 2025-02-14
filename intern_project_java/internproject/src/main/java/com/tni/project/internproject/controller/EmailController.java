package com.tni.project.internproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RestController;

import com.tni.project.internproject.model.User;
import com.tni.project.internproject.service.EmailService;

@RestController
@Scope("prototype")
public class EmailController {
	
	@Autowired
	private EmailService emailService;
	

	public void sendEmail(int userID) {
		
		// call Service email controller
		emailService.sendEmail(userID);
		
	}
	
}
