package com.tni.project.internproject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.model.Preference;
import com.tni.project.internproject.model.User;
import com.tni.project.internproject.repo.PreferenceRepo;
import com.tni.project.internproject.repo.UserRepo;

@Service
public class UserService {

	@Autowired
	private UserRepo userRepo;
	@Autowired
	private PreferenceRepo prefRepo;

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
		
		// return User
		return ResponseEntity.ok(user);

	}

	public void logout() {
		
		// Do some logout stuff

	}

	public ResponseEntity<?> getPreference(int userID) {
		return null;
	}
}
