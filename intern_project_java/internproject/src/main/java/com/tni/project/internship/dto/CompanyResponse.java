package com.tni.project.internship.dto;

import java.util.List;

import com.tni.project.internproject.model.CompanyJP;
import com.tni.project.internproject.model.CompanyUS;

public class CompanyResponse {

	private List<CompanyUS> companyUS;
	private List<CompanyJP> companyJP;

	public List<CompanyUS> getCompanyUS() {
		return companyUS;
	}

	public void setCompanyUS(List<CompanyUS> companyUS) {
		this.companyUS = companyUS;
	}

	public List<CompanyJP> getCompanyJP() {
		return companyJP;
	}

	public void setCompanyJP(List<CompanyJP> companyJP) {
		this.companyJP = companyJP;
	}
	
	

}
