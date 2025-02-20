package com.tni.project.internproject.controller;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tni.project.internproject.model.Company;
import com.tni.project.internproject.service.CompanyService;

@RestController
@CrossOrigin("*")
public class CompanyController {
	
	@Autowired
	CompanyService service;
	
	@RequestMapping("/fetchIPO")
	public  List<Company>  fetchAll() {
		 try {
			return service.fetchAll();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
