package com.tni.project.internship.dto;

import java.util.List;

import com.tni.project.internproject.model.Industry;

public class UserSetting {
	private int userID;
	private String username;
	private String email;
	private int hour;
	private int min;
	private String period;
	private List<Integer> days;
	private boolean receiveEmail;
	private List<String> industries;
	
	
	
	public UserSetting() {
		
	}


	

	public UserSetting(int userID, String username, String email, int hour, int min, String period, List<Integer> days,
			boolean receiveEmail, List<String> industries) {
		super();
		this.userID = userID;
		this.username = username;
		this.email = email;
		this.hour = hour;
		this.min = min;
		this.period = period;
		this.days = days;
		this.receiveEmail = receiveEmail;
		this.industries = industries;
	}



	public int getUserID() {
		return userID;
	}
	public void setUserID(int userID) {
		this.userID = userID;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getHour() {
		return hour;
	}
	public void setHour(int hour) {
		this.hour = hour;
	}
	public int getMin() {
		return min;
	}
	public void setMin(int min) {
		this.min = min;
	}
	public String getPeriod() {
		return period;
	}
	public void setPeriod(String period) {
		this.period = period;
	}
	public boolean isReceiveEmail() {
		return receiveEmail;
	}
	public void setReceiveEmail(boolean receiveEmail) {
		this.receiveEmail = receiveEmail;
	}
	public List<String> getIndustries() {
		return industries;
	}
	public void setIndustries(List<String> industries) {
		this.industries = industries;
	}
	
	public List<Integer> getDays() {
		return days;
	}


	public void setDays(List<Integer> days) {
		this.days = days;
	}
	
	
	
}
