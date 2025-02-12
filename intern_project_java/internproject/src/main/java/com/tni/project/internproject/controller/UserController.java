package com.tni.project.internproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tni.project.internproject.model.User;
import com.tni.project.internproject.service.UserService;

import ch.qos.logback.core.joran.spi.HttpUtil.RequestMethod;

@RestController
public class UserController {

	@Autowired
	private UserService service;
	
	public void login() {
		
	}
	
	@PostMapping(path = "/signup")
	@ResponseBody
	public ResponseEntity<?> signUp(@RequestParam String username,
			@RequestParam String password,
			@RequestParam String confirmPassword,
			@RequestParam String email,
			@RequestParam String receiveEmail) {
		
		// pass all args to service layer
		return service.signUp(username, password, confirmPassword, email, receiveEmail);
	}
	
	public void logout() {
		service.logout();
	}
	
	public void getPreference(int userID) {
		service.getPreference(userID);
	}
}
