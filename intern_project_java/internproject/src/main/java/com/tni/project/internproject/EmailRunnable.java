package com.tni.project.internproject;

import org.apache.catalina.core.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.tni.project.internproject.controller.EmailController;
import com.tni.project.internproject.controller.EmailTempController;
import com.tni.project.internproject.model.User;


public class EmailRunnable implements Runnable {
	
	private User user;
	@Autowired
	private final EmailController emailController;


	
	public EmailRunnable(User user, EmailController emailController) {
		this.user = user;
		this.emailController = emailController;
	}
	
	@Override
	public void run() {
		//System.out.println("Hi from: " + user.getUserName());
		emailController.sendEmail(user);
		
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	

}
