package com.tni.project.internproject.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.Industry;

@Repository
public interface IndustryRepo extends JpaRepository<Industry, Integer>{
	
	Industry findByIndustryName(String industryName);
}
