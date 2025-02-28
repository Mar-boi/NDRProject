package com.tni.project.internproject.controller;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tni.project.internproject.model.Company;
import com.tni.project.internproject.service.CombinedCompanyService;
import com.tni.project.internproject.service.CompanyUSService;
import com.tni.project.internship.dto.CompanyResponse;

@RestController
@CrossOrigin("*")
public class CompanyController {
	
	@Autowired
	CombinedCompanyService service;
	
	@GetMapping("/fetchIPO")
	public CompanyResponse  fetchAll() {
		 return service.fetchAll();

	}

	//@Scheduled(cron = "0 * * * * *")
	public void saveToDB() {
		System.out.println("Fetching and saving...");
		service.saveToDB();
		
	}

}
