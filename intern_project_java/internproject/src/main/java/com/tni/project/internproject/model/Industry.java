package com.tni.project.internproject.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
public class Industry {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int industryID;
	@Column(nullable = false)
	private String industryName;
	

	
	public Industry() {
		
	}
	
	public Industry(int industryID, String industryName, Set<Company> company) {
		this.industryID = industryID;
		this.industryName = industryName;

	}

	public int getIndustryID() {
		return industryID;
	}

	public void setIndustryID(int industryID) {
		this.industryID = industryID;
	}

	public String getIndustryName() {
		return industryName;
	}

	public void setIndustryName(String industryName) {
		this.industryName = industryName;
	}


	
}
