package com.tni.project.internproject.repo;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.User;

@Repository
public interface UserRepo extends CrudRepository<User, Integer>{

	public User findByUserName(String userName);
	public User findByUserEmail(String userEmail);
}
