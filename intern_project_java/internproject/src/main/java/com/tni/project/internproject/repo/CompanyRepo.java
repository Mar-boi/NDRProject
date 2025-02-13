package com.tni.project.internproject.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.Company;

@Repository
public interface CompanyRepo extends JpaRepository<Company, Integer> {

	
}
