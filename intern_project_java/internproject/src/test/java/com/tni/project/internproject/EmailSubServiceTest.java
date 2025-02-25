package com.tni.project.internproject;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.tni.project.internproject.repo.EmailRepo;
import com.tni.project.internproject.service.EmailSubService;

import lombok.experimental.var;

@SpringBootTest
public class EmailSubServiceTest {
	@Autowired
	EmailRepo emailRepo;
	@Autowired
	EmailSubService emailSubService;
	
	// It has nothing to do with a preference DB so we can fake that the user exists in the DB!
	
	@Test
	public void testUpdate_ActiveToActive() {
		emailRepo.loadAll();
		System.out.println(emailRepo.getEmailList());
		
		var userID = 2;
		var cron = "* 0 8 * * *";
		
		emailSubService.update(userID, cron, true, true);
		assertTrue(emailRepo.getEmailList().containsKey(userID));
	}
	
	@Test
	public void testUpdate_ActiveToInactive() {
		emailRepo.loadAll();
		System.out.println(emailRepo.getEmailList());
		
		var userID = 2;
		var cron = "* 0 8 * * *";
		
		emailSubService.update(userID, cron, true, false);
		assertFalse(emailRepo.getEmailList().containsKey(userID));
	}
	
	@Test
	public void testUpdate_InactiveToActive() {
		emailRepo.loadAll();
		System.out.println(emailRepo.getEmailList());
		
		var userID = 3;
		var cron = "* 0 8 * * *";
		
		emailSubService.update(userID, cron, false, true);
		assertTrue(emailRepo.getEmailList().containsKey(userID));
	}
	
	@Test
	public void testUpdate_InactiveToInactive() {
		emailRepo.loadAll();
		System.out.println(emailRepo.getEmailList());
		
		var userID = 3;
		var cron = "* 0 8 * * *";
		
		emailSubService.update(userID, cron, false, false);
		assertFalse(emailRepo.getEmailList().containsKey(userID));
	}
	
	@Test
	public void testUpdate_InvalidUserID() {
		emailRepo.loadAll();
		System.out.println(emailRepo.getEmailList());
		
		var userID = 1; // doesn't exist in the HashMap at first
		var cron = "* 0 8 * * *";
		
		emailSubService.update(userID, cron, true, true);
		assertTrue(emailRepo.getEmailList().containsKey(userID));

		
	}
	
}
