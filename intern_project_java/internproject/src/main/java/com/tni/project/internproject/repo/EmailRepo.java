package com.tni.project.internproject.repo;

import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ScheduledFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.EmailRunnable;
import com.tni.project.internproject.EmailScheduler;
import com.tni.project.internproject.controller.EmailController;
import com.tni.project.internproject.model.Preference;
import com.tni.project.internproject.model.User;

@Repository
public class EmailRepo {
	@Autowired
	PreferenceRepo prefRepo;
	
	@Autowired
	EmailScheduler scheduler;
	
	@Autowired
	EmailController emailController;
	
	
	HashMap<Integer, ScheduledFuture<?>> mailList = new HashMap<Integer, ScheduledFuture<?>>();
	
	// for load all the schedule when started
	public void loadAll() {
		
		// load all of the User x Pref WHERE receiveEmail = 1
		List<Preference> prefList = prefRepo.findSubscriber();
		
		// For each every row
		for (Preference preference : prefList) {
			
			User user = preference.getUser();
			
			// Make ScheduledFuture using the info
			//ScheduledFuture<?> future = scheduler.schedule(new EmailRunnable(user), new CronTrigger(preference.getEmailSchedule()));
			
			ScheduledFuture<?> future = scheduler.schedule(new EmailRunnable(user, emailController), new CronTrigger(preference.getEmailSchedule()));
			
			
			// put it in the list
			mailList.put(user.getUserID(), future);
			
		}
		
		
	}
	
	public void add() {
		
	}
	
	public void delete() {
			
	}
	
	public void update() {
		
	}
}
