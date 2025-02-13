package com.tni.project.internproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tni.project.internproject.repo.CompanyRepo;

@Service
public class CompanyService {
	@Autowired
	CompanyRepo repo;
}
