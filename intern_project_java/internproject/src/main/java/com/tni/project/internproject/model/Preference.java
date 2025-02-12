package com.tni.project.internproject.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@Data
public class Preference {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int preferenceID;
	private boolean receiveEmail;
	private String emailSchedule;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "userID")
	private User user;
	
	public Preference() {
		
	}
	
	public Preference(boolean receiveEmail, User user) {
		this.receiveEmail = receiveEmail;
		this.emailSchedule = "0 0 8 * * *";
		this.user = user;
	}

	public int getPreferenceID() {
		return preferenceID;
	}

	public void setPreferenceID(int preferenceID) {
		this.preferenceID = preferenceID;
	}

	public boolean isReceiveEmail() {
		return receiveEmail;
	}

	public void setReceiveEmail(boolean receiveEmail) {
		this.receiveEmail = receiveEmail;
	}

	public String getEmailSchedule() {
		return emailSchedule;
	}

	public void setEmailSchedule(String emailSchedule) {
		this.emailSchedule = emailSchedule;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	
	
}
