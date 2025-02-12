package com.tni.project.internproject.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.User;

@Repository
public interface UserRepo extends CrudRepository<User, Integer>{

	User findByUserName(String userName);
	User findByUserEmail(String userEmail);
	
	@Query("select u from User u where (u.userName = ?1 or u.userEmail = ?1 ) and u.userPass = ?2 ")
	User findLoginUser(String nameEmail, String password);
	
}
