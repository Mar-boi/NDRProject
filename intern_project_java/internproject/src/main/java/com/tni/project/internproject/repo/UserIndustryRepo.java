 package com.tni.project.internproject.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.UserIndustry;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserIndustryRepo extends JpaRepository<UserIndustry, Integer>{
	
	@NativeQuery("SELECT i.industry_name from user_industry as a inner join industry as i on i.industryid = a.industryid where a.userid = ? order by 1")
	 List<String> findNameByUserID(int userID);
	
	
	@Query("SELECT i.industry.id from UserIndustry i where i.user.id = ?1")
	Optional<List<Integer>> findByUserID(int userID);

	@Modifying
	@Transactional
	@Query("Delete from UserIndustry u where u.user.id = ?1 and u.industry.id = ?2")
	void deleteByUserID(int userID, int industryID);
}
