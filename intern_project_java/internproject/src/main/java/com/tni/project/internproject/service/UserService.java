package com.tni.project.internproject.service;

import java.net.PasswordAuthentication;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.tni.project.internship.dto.UserSetting;

import ch.qos.logback.classic.pattern.Util;

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
		if (user == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot find user");
		} else {
			return ResponseEntity.ok(user);
		}
	}

	public ResponseEntity<?> signUp(String username, String password, String confirmPassword, String email,
			boolean receiveEmail) {

		// check email validation (HANDLE AT FRONT END?)
		// check if the email already exists
		if (userRepo.findByUserEmail(email) != null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken");
		}
		// check if the username already exists
		if (userRepo.findByUserName(username) != null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");

		}
		// check if the pass = confirm pass
		if (!password.equals(confirmPassword)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords don't match");

		}

		// if all correct, call repo to save
		userRepo.save(new User(username, password, email));

		// query the user using username
		User user = userRepo.findByUserName(username);

		// call repo to save a user pref
		Preference pref = new Preference(receiveEmail, user);
		prefRepo.save(pref);

		// Include a new user to the current mailRepo list
		if (receiveEmail) {
			emailSubService.add(user.getUserID(), pref.getEmailSchedule());
		}

		// return User
		System.out.println(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(user);

	}

	public ResponseEntity<?> getPreference(int userID) {

		User user = userRepo.findById(userID).orElse(null);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found"); // should not happen cause
																							// they should
			// access in the first place
		} else {

			// find Preference from userID -> Preference
			Preference pref = prefRepo.findByUserID(userID);

			// find inudusry name from userID -> List<String>
			List<Integer> industry = userInRepo.findByUserID(userID).orElse(null);

			// create a new UserSetting DTO
			UserSetting userSetting = new UserSetting();

			// imsert data into DTO
			userSetting.setEmail(user.getUserEmail());
			userSetting.setUserID(userID);
			userSetting.setUsername(user.getUserName());
			userSetting.setReceiveEmail(pref.isReceiveEmail());

			String cron = pref.getEmailSchedule();
			userSetting.setHour(CronUtil.getHour(cron));
			userSetting.setMin(CronUtil.getMin(cron));
			userSetting.setPeriod(CronUtil.getPeriod(cron));
			userSetting.setDays(CronUtil.getDays(cron));

			userSetting.setIndustries(industry);

			// send a data as UserSetting DTO
			return ResponseEntity.status(HttpStatus.OK).body(userSetting);
		}

	}

	public ResponseEntity<?> updatePreference(List<Integer> days, int hour, int min, String period,
			boolean receiveEmail, List<Integer> industries, int userID) {

		try {

			// parse to CronNotation
			String cronNotation = CronUtil.getCronNotation(days, hour, min, period);

			// Getting old preference
			Preference oldPref = prefRepo.findByUserID(userID);

			// Update Email list via emailSubService
			emailSubService.update(userID, cronNotation, oldPref.isReceiveEmail(), receiveEmail);

			// Preference DB: Update the preference where userID = userID
			prefRepo.update(userID, cronNotation, receiveEmail);

			// UserIndustry DB: Delete and Add
			updateIndustry(industries, userID);

			return ResponseEntity.status(HttpStatus.OK).body(getPreference(userID));
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Updating");
		}

	}

	public void updateIndustry(List<Integer> industries, int userID) {

		Set<Integer> newSet = new HashSet<>(industries);

		// query the userindustry with userID = userID
		Set<Integer> oldSet = new HashSet<>(userInRepo.findByUserID(userID).orElse(null));

		for (int inID : newSet) {
			if (!oldSet.contains(inID)) {

				// add in DB
				UserIndustry userIndustry = new UserIndustry();
				User user = userRepo.findById(userID).orElse(null);
				Industry industry = inRepo.findById(inID).orElse(null);

				userIndustry.setUser(user);
				userIndustry.setIndustry(industry);

				userInRepo.save(userIndustry);
			}
		}

		for (int inID : oldSet) {
			if (!newSet.contains(inID)) {
				// delete from DB
				userInRepo.deleteByUserID(userID, inID);
			}
		}
	}

	public ResponseEntity<?> updateProfile(String username, String email, int userID, String pass, String newPass) {
		username = username.trim();
		email = email.trim();
		pass = pass.trim();
		newPass= newPass.trim();
		
		try {
			// check if the username is already existed for different user
			if(username.length() == 0) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be null");
			}
			
			if (userRepo.findOtherByUsername(username, userID).orElse(null) != null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");

			}

			// check if the email is already existed for different user
			if (userRepo.findOtherByEmail(username, userID).orElse(null) != null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken");
			}

			User user = userRepo.findByUserID(userID).orElse(null);

			// User does not update password
			if (pass.equals("") && newPass.equals("")) {
				newPass = user.getUserPass();
			} else {
				
				
				if (!user.getUserPass().equals(pass)) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password does not match");
				}
				
				if(newPass.length() < 8) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password must contain at least 8 characters");
				}
				
				
			}

			userRepo.updateProfile(username, email, newPass, userID);

			return ResponseEntity.status(HttpStatus.OK).body("Update Successful");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Updating");

		}
	}
}
