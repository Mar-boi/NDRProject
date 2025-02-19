package com.tni.project.internproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.repo.EmailRepo;

@Service
public class EmailSubService {
	
	@Autowired
	EmailRepo emailRepo;

	public void update(int userID, String cronNotation, boolean oldPref, boolean newPref) {
		
		// old = true
		if(oldPref) {
			// cancel
			cancel(userID);
			// remove
			remove(userID);
		}
		
		// new = true
		if(newPref) {
			// add
			add(userID, cronNotation);
		}
		
		
	}
	
	public void remove(int userID) {
		emailRepo.remove(userID);
	}
	
	public void add(int userID, String cronNotation) {
		emailRepo.add(userID, cronNotation);
	}
	
	public void cancel(int userID) {
		emailRepo.cancel(userID);
	}
}
