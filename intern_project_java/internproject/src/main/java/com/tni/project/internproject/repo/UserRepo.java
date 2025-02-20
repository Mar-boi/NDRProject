package com.tni.project.internproject.repo;

import java.util.Optional;

import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.User;
import com.tni.project.internship.dto.UserSetting;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepo extends CrudRepository<User, Integer>{

	User findByUserName(String userName);
	User findByUserEmail(String userEmail);
	
	@Query("select u from User u where (u.userName = ?1 or u.userEmail = ?1 ) and u.userPass = ?2 ")
	User findLoginUser(String nameEmail, String password);
	
	@Modifying
	@Transactional
	@Query("update User u set u.userName = ?1, u.userEmail = ?2 where u.userID = ?3 ")
	void updateProfile(String username, String email, int userID);
	
	@Query("select u from User u where (u.userName = ?1 or u.userEmail = ?2) and u.userID != ?3")
	Optional<User> findExistingUser(String username, String email, int userID);

}
