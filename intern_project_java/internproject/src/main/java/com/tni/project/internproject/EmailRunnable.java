package com.tni.project.internproject;


import org.springframework.beans.factory.annotation.Autowired;
import com.tni.project.internproject.controller.EmailController;



public class EmailRunnable implements Runnable {
	
	private int userID;
	@Autowired
	private final EmailController emailController;


	
	public EmailRunnable(int userID, EmailController emailController) {
		this.userID = userID;
		this.emailController = emailController;
	}
	
	@Override
	public void run() {
		//System.out.println("Hi from: " + userID);
		emailController.sendEmail(userID);
		
	}

	public int getUserID() {
		return userID;
	}

	public void setUser(int userID) {
		this.userID = userID;
	}
	
	

}
