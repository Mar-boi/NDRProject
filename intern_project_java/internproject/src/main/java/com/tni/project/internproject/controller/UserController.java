 package com.tni.project.internproject.controller;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tni.project.internproject.model.Industry;
import com.tni.project.internproject.model.User;
import com.tni.project.internproject.service.UserService;


@RestController
@CrossOrigin(  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT}, 
allowedHeaders = "*" )
public class UserController {

	@Autowired
	private UserService service;
	
	@PostMapping(path = "/login")
	@ResponseBody
	public ResponseEntity<?> login(@RequestBody Map<String, Object> requestBody) {
		
		String username = (String) requestBody.get("username");
		String password = (String) requestBody.get("password");
		
		// pass all args to service layer
		return service.login(username, password);
		
	}
	
	@PostMapping(path = "/signup")
	@ResponseBody
	public ResponseEntity<?> signUp(@RequestBody Map<String, Object> requestBody) {
		String username = (String) requestBody.get("username");
		String email = (String) requestBody.get("email");
		String password = (String) requestBody.get("password");
		String confirmPassword = (String) requestBody.get("cfpassword");
		boolean receiveEmail = (Boolean) requestBody.get("receiveEmail");
		
		// pass all args to service layer
		return service.signUp(username, password, confirmPassword, email, receiveEmail);
	}
	
	public void logout() {
		service.logout();
	}
	
	// Haven't used yet cause I have no idea where to use
	@GetMapping(path = "/getPreference") // probably
	public ResponseEntity<?> getPreference(@RequestParam int userID) {
		return service.getPreference(userID);
	}
	
	@RequestMapping("/updatePreference")
	public ResponseEntity<?> updatePreference(@RequestBody Map<String, Object> requestBody) {
		 List<Integer> days = (List<Integer>) requestBody.get("days");
		 int hour = (Integer) requestBody.get("hour");
		 int min =  (Integer) requestBody.get("min");
		 String period = (String) requestBody.get("period");
		 boolean receiveEmail = (Boolean) requestBody.get("receiveEmail");
		 List<Integer> industries = (List<Integer>) requestBody.get("industries");
		 int userID =  (Integer) requestBody.get("userID");
		 
		 
		 return service.updatePreference(days,hour,min,period,receiveEmail,industries,userID);
		
	}
}
