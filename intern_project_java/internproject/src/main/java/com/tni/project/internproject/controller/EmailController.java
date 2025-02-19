package com.tni.project.internproject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	@GetMapping("/writeMail")
	public void testWriteMail(@RequestParam String name) {
		emailService.testWriteMail(name);
	}
	

	
}
