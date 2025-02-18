package com.tni.project.internproject.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.Company;

import jakarta.transaction.Transactional;

@Repository
public interface CompanyRepo extends JpaRepository<Company, Integer> {

	Optional<Company> findBySymbol(String symbol);

	@NativeQuery("Select * from company order by offer_date desc, compid limit ?1")
	List<Company> fetchLast(int amount);

	@Modifying
	@Transactional
	@Query("Update Company as c set c.offerDate = offerDate where symbol = symbol")
	void update(Company company);
	
	@NativeQuery("Select * from company where datediff(sysdate(), offer_date) <= 7")
	List<Company> fetchLastWeek();

	@Query("select c from Company c where c.industry.id = ?1")
	List<Company> fetchTopIndustry(int industry);
	


	
}
