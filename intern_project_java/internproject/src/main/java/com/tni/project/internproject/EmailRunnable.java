package com.tni.project.internproject;

import org.springframework.beans.factory.annotation.Autowired;

import com.tni.project.internproject.controller.EmailController;
import com.tni.project.internproject.model.User;

public class EmailRunnable implements Runnable {
	
	private User user;
	@Autowired
	private EmailController emailController;


	
	public EmailRunnable(User user) {
		this.user = user;
	}
	
	// WHAT TO DO TMR: How to call a controller without using a request mapping
	
	@Override
	public void run() {
		//System.out.println("Hi from: " + user.getUserName());
		//emailController.sendEmail(user);
		
	}

}
