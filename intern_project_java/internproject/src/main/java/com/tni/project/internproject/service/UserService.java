package com.tni.project.internproject.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.tni.project.internproject.model.Industry;
import com.tni.project.internproject.model.Preference;
import com.tni.project.internproject.model.User;
import com.tni.project.internproject.model.UserIndustry;
import com.tni.project.internproject.repo.IndustryRepo;
import com.tni.project.internproject.repo.PreferenceRepo;
import com.tni.project.internproject.repo.UserIndustryRepo;
import com.tni.project.internproject.repo.UserRepo;
import com.tni.project.internproject.util.CronUtil;

@Service
public class UserService {

	@Autowired
	private UserRepo userRepo;
	@Autowired
	private PreferenceRepo prefRepo;
	@Autowired
	private UserIndustryRepo userInRepo;
	@Autowired
	private IndustryRepo inRepo;
	@Autowired
	private EmailSubService emailSubService;


	public ResponseEntity<?> login(String nameEmail, String password) {
		User user = userRepo.findLoginUser(nameEmail, password);
		if(user == null) {
			return ResponseEntity.ok("Login error");
		}
		else {
			return ResponseEntity.ok(user);
		}
	}

	public ResponseEntity<?> signUp(String username, String password, String confirmPassword, String email, String receiveEmail) {

		// check email validation (HANDLE AT FRONT END?)
		// check if the email already exists
		if (userRepo.findByUserEmail(email) != null) {
			return ResponseEntity.ok("Email is already taken");
		}
		// check if the username already exists
		if (userRepo.findByUserName(username) != null) {
			return ResponseEntity.ok("Username is already taken");

		}

		// check if the pass = confirm pass (HANDLE AT FRONT END?)
		// if all correct, call repo to save
		userRepo.save(new User(username, password, email));

		// query the user using username
		User user = userRepo.findByUserName(username);

		// call repo to save a user pref
		Preference pref = new Preference(receiveEmail.equals("1"), user);
		prefRepo.save(pref);
		
		// Include a new user to the current mailRepo list
		
		// return User
		return ResponseEntity.ok(user);

	}

	public void logout() {
		
		// Do some logout stuff

	}

	public ResponseEntity<?> getPreference(int userID) {
		return null;
	}

	public String updatePreference(List<Integer> days, int hour, int min, String period, boolean receiveEmail,
			List<Integer> industries, int userID) {
		
		// parse to CronNotation
		String cronNotation = CronUtil.getCronNotation(days, hour, min, period);
		
		// Getting old preference
		Preference oldPref = prefRepo.findByUserID(userID);
		
		// Update Email list via emailSubService
		emailSubService.update(userID, cronNotation, oldPref.isReceiveEmail(), receiveEmail);
		
		// Preference DB: Update the preference where userID = userID
		prefRepo.update(userID,cronNotation,receiveEmail);
		
		// UserIndustry DB: Delete and Add
		updateIndustry(industries, userID);
		
		// Passing back values
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		try {
			String prefJson = ow.writeValueAsString(prefRepo.findByUserID(userID));
			String userInJson = ow.writeValueAsString(userInRepo.findByUserID(userID).orElse(null));
			return prefJson + userInJson;
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
		
		
	}
	
	public void updateIndustry(List<Integer> industries, int userID) {
		
		Set<Integer> newSet = new HashSet<>(industries);
		
		// query the userindustry with userID = userID
		Set<Integer> oldSet = new HashSet<>(userInRepo.findByUserID(userID).orElse(null));
		
		for(int inID: newSet ) {
			if(!oldSet.contains(inID)) {
				
				// add in DB
				UserIndustry userIndustry = new UserIndustry();
				User user = userRepo.findById(userID).orElse(null);
				Industry industry = inRepo.findById(inID).orElse(null);
				
				userIndustry.setUser(user);
				userIndustry.setIndustry(industry);
				
				userInRepo.save(userIndustry);
			}
		}
		
		for(int inID: oldSet) {
			if(!newSet.contains(inID)) {
				// delete from DB
				userInRepo.deleteByUserID(userID, inID);
			}
		}
	}
}
