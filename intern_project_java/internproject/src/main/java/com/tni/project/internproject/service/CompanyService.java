package com.tni.project.internproject.service;

import java.util.List;

import com.tni.project.internproject.model.Company;

public interface CompanyService<T extends Company> {

	public List<T> fetchAll();

	public void filterNewCompany(T company);

	public void saveToDB();

	public List<T> fetchLast(int amount);

	public List<T> fetchLastWeek();
}
