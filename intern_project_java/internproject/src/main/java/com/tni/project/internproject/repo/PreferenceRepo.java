package com.tni.project.internproject.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tni.project.internproject.model.Preference;

@Repository
public interface PreferenceRepo extends JpaRepository<Preference, Integer>{

	@Query("select p from Preference p where p.receiveEmail = true")
	List<Preference> findSubscriber();
}
