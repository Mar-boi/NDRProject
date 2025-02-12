package com.tni.project.internproject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.model.User;
import com.tni.project.internproject.repo.IndustryRepo;
import com.tni.project.internproject.repo.UserIndustryRepo;

@Service
public class EmailService {
	
	@Autowired
	UserIndustryRepo userIndustryRepo;
	@Autowired
	IndustryRepo industryRepo;

	public void sendEmail(User user) {
		// 1. Get a user's industry list
		// 1.1 call userIndustry repo for the list
		List<String> industryList = userIndustryRepo.findByUserID(user.getUserID());
		
		
		
		// 2 Write an email [to be refined]
		// 2.1 return a industry list of the user
		System.out.println("List for" + user.getUserName() + ": " + industryList );
	}

}
