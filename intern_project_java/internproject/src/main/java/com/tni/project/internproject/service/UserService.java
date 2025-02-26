package com.tni.project.internproject.service;

import java.net.PasswordAuthentication;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
			return buildErrorResponse("Cannot find user", HttpStatus.BAD_REQUEST);
		} else {
			return ResponseEntity.ok(user);
		}
	}

	public ResponseEntity<?> signUp(String username, String password, String confirmPassword, String email,
			boolean receiveEmail) {

		// check email validation 
		// check if the email already exists
		if (userRepo.findByUserEmail(email) != null) {
			return buildErrorResponse("Email is already taken", HttpStatus.BAD_REQUEST);
		}
		// check if the username already exists
		if (userRepo.findByUserName(username) != null) {
			return buildErrorResponse("Username is already taken", HttpStatus.BAD_REQUEST);

		}
		// check if the pass = confirm pass
		if (!password.equals(confirmPassword)) {
			return buildErrorResponse("Passwords don't match", HttpStatus.BAD_REQUEST);

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
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No preference found"); // should not happen cause
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
			return ResponseEntity.ok(userSetting);
		}

	}

	public ResponseEntity<?> updatePreference(List<Integer> days, int hour, int min, String period,
			boolean receiveEmail, List<Integer> industries, int userID) {

		try {

			// parse to CronNotation
			String cronNotation = CronUtil.getCronNotation(days, hour, min, period);

			// Getting old preference
			Preference oldPref = prefRepo.findByUserID(userID);

			if (oldPref == null) {
				return buildErrorResponse("No preference found", HttpStatus.NOT_FOUND);
			}

			// Update Email list via emailSubService
			emailSubService.update(userID, cronNotation, oldPref.isReceiveEmail(), receiveEmail);

			// Update the preference
			oldPref.setEmailSchedule(cronNotation);
			oldPref.setReceiveEmail(receiveEmail);

			// Save preference to the DB (better than using our own method probably because
			// of cache)
			prefRepo.save(oldPref);

			// UserIndustry DB: Delete and Add
			updateIndustry(industries, userID);

			return getPreference(userID);
		} catch (Exception e) {
			System.out.println(e);
			return buildErrorResponse("Error updating", HttpStatus.BAD_REQUEST);
		}

	}

	public void updateIndustry(List<Integer> industries, int userID) {

		Set<Integer> newSet = new HashSet<>(industries);
		newSet = newSet.stream().filter(value -> value != null && value != 0).collect(Collectors.toSet());

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
		// Trim inputs
	    username = trimInput(username);
	    email = trimInput(email);
	    pass = trimInput(pass);
	    newPass = trimInput(newPass);

	    try {
	        // Validate the inputs
	        if (username.isEmpty()) {
	            return buildErrorResponse("Username cannot be null", HttpStatus.BAD_REQUEST);
	        }

	        if (isUsernameTaken(username, userID)) {
	            return buildErrorResponse("Username is already taken", HttpStatus.BAD_REQUEST);
	        }

	        if (isEmailTaken(email, userID)) {
	            return buildErrorResponse("Email is already taken", HttpStatus.BAD_REQUEST);
	        }

	        if (!isValidEmail(email)) {
	            return buildErrorResponse("Invalid email format", HttpStatus.BAD_REQUEST);
	        }

	        User user = getUser(userID);
	        if (user == null) {
	            return buildErrorResponse("User not found", HttpStatus.NOT_FOUND);
	        }

	     // Password validation: only required if user wants to change password
	        if (isChangePassword(pass, newPass)) {
	            if (!isPasswordValid(pass, user)) {
	                return buildErrorResponse("Current password does not match", HttpStatus.BAD_REQUEST);
	            }
	            if (isNewPasswordInvalid(newPass)) {
	                return buildErrorResponse("New password must contain at least 8 characters", HttpStatus.BAD_REQUEST);
	            }
	        }

	        // Update user profile
	        updateUserProfile(username, email, newPass, userID);
	        return ResponseEntity.ok("Update Successful");

	    } catch (Exception e) {
	        e.printStackTrace();
	        return buildErrorResponse("Error Updating", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	// Helper Classes
	private boolean isValidEmail(String email) {
	    String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
	    return email.matches(emailRegex);
	}
	private String trimInput(String input) {
	    return input == null ? "" : input.trim();
	}

	private boolean isUsernameTaken(String username, int userID) {
	    return userRepo.findOtherByUsername(username, userID).isPresent();
	}

	private boolean isEmailTaken(String email, int userID) {
	    return userRepo.findOtherByEmail(email, userID).isPresent();
	}

	private User getUser(int userID) {
	    return userRepo.findByUserID(userID).orElse(null);
	}

	private boolean isChangePassword(String pass, String newPass) {
	    return !pass.isEmpty() || !newPass.isEmpty();
	}

	private boolean isPasswordValid(String pass, User user) {
	    return user.getUserPass().equals(pass);
	}

	private boolean isNewPasswordInvalid(String newPass) {
	    return newPass.length() < 8;
	}

	private void updateUserProfile(String username, String email, String newPass, int userID) {
	    userRepo.updateProfile(username, email, newPass, userID);
	}

	private ResponseEntity<?> buildErrorResponse(String message, HttpStatus status) {
	    return ResponseEntity.status(status).body(message);
	}

}
