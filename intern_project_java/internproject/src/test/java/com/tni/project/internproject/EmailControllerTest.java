package com.tni.project.internproject;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.tni.project.internproject.controller.EmailController;


@SpringBootTest
public class EmailControllerTest {
	@Autowired
	EmailController emailController;
	
	@Test
	public void testSendEmail() {
		var userID = 2;
		emailController.sendEmail(userID);
	}
}
