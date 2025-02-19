package com.tni.project.internproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.tni.project.internproject.repo.EmailRepo;

@SpringBootApplication
@EnableScheduling
public class InternprojectApplication {

	public static void main(String[] args) {
		//SpringApplication.run(InternprojectApplication.class, args);
		ConfigurableApplicationContext context =  SpringApplication.run(InternprojectApplication.class, args);
		
		EmailRepo mailRepo = context.getBean(EmailRepo.class);
		mailRepo.loadAll();
	}

}
