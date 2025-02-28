package com.tni.project.internproject.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.CompanyJP;

import jakarta.transaction.Transactional;

@Repository
public interface CompanyJPRepo extends JpaRepository<CompanyJP, Integer> {

	Optional<CompanyJP> findBySymbol(String symbol);

	@NativeQuery("Select * from jp_companies order by offer_date desc, compid limit ?1")
	List<CompanyJP> fetchLast(int amount);

	@Modifying
	@Transactional
	@Query("Update CompanyJP as c set c.offerDate = offerDate where symbol = symbol")
	void update(CompanyJP company);
	
	@NativeQuery("Select * from jp_companies where datediff(sysdate(), offer_date) <= 7")
	List<CompanyJP> fetchLastWeek();

	@Query("select c from CompanyJP c where c.industry.id = ?1")
	List<CompanyJP> fetchTopIndustry(int industry);
	


	
}
