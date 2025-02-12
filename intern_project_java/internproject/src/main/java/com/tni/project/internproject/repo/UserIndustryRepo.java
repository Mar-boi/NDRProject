package com.tni.project.internproject.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.UserIndustry;
import java.util.List;


@Repository
public interface UserIndustryRepo extends JpaRepository<UserIndustry, Integer>{
	
	@NativeQuery("SELECT i.industry_name from user_industry as a inner join industry as i")
	 List<String> findByUserID(int userID);
}
