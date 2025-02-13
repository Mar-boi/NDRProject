package com.tni.project.internproject.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CompanyController {
	
	@RequestMapping("/")
	public String getAll() {
		return "Hi";
	}

}
