package com.tni.project.internproject;

import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

@Component
public class EmailScheduler extends ThreadPoolTaskScheduler {

	public EmailScheduler() {
		super();
		setPoolSize(5);
	}
}
