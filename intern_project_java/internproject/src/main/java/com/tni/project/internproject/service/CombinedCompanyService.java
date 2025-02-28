package com.tni.project.internproject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.model.CompanyJP;
import com.tni.project.internproject.model.CompanyUS;
import com.tni.project.internship.dto.CompanyResponse;

@Service
public class CombinedCompanyService {
	
	@Autowired
	CompanyUSService compUSService;
	
	@Autowired
	CompanyJPService compJPService;
	
	// Return as DTO
	public CompanyResponse fetchAll() {
		CompanyResponse response = new CompanyResponse();
		List<CompanyUS> compUS = compUSService.fetchAll();
		List<CompanyJP> compJP = compJPService.fetchAll();
		
		response.setCompanyUS(compUS);
		response.setCompanyJP(compJP);
		
		return response;
	}
	
	public void saveToDB() {
		
		compUSService.saveToDB();
		compJPService.saveToDB();
		
	}
	
	

}
