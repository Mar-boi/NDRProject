package com.tni.project.internproject.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.CompanyUS;

import jakarta.transaction.Transactional;

@Repository
public interface CompanyUSRepo extends JpaRepository<CompanyUS, Integer> {

	Optional<CompanyUS> findBySymbol(String symbol);

	@NativeQuery("Select * from us_companies order by offer_date desc, compid limit ?1")
	List<CompanyUS> fetchLast(int amount);

	@Modifying
	@Transactional
	@Query("Update CompanyUS as c set c.offerDate = offerDate where symbol = symbol")
	void update(CompanyUS company);
	
	@NativeQuery("Select * from us_companies where datediff(sysdate(), offer_date) <= 7")
	List<CompanyUS> fetchLastWeek();

	@Query("select c from CompanyUS c where c.industry.id = ?1 order by c.returnRate desc limit 3")
	List<CompanyUS> fetchTopIndustry(int industry);
	
	


	
}
