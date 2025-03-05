package com.tni.project.internproject;

import static org.hamcrest.Matchers.containsInAnyOrder;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;

	private String generateUserJSON(String email, String username, String pass, String cfPass, boolean receiveEmail)
			throws JsonProcessingException {
		return objectMapper.writeValueAsString(Map.of("email", email, "username", username, "password", pass,
				"cfpassword", cfPass, "receiveEmail", receiveEmail));
	}

	private String generatePref(List<Integer> days, int hour, int min, String period, boolean receiveEmail,
			List<Integer> industries, int userID) throws JsonProcessingException {
		return objectMapper.writeValueAsString(Map.of("days", days, "hour", hour, "min", min, "period", period,
				"receiveEmail", receiveEmail, "industries", industries, "userID", userID));
	}

	private String generateProfileJSON(int userID, String email, String username, String pass, String newPass)
			throws JsonProcessingException {
		return objectMapper.writeValueAsString(Map.of("userID", userID, "email", email, "username", username,
				"password", pass, "newPassword", newPass));
	}

	@Test
	public void testLogin_validUser() throws Exception {
		var username = "tinyfish";
		var password = "12345678";
		String jsonString = "{\r\n" + "    \"username\": \"" + username + "\",\r\n" + "    \"password\": \"" + password
				+ "\"\r\n" + "}";

		mockMvc.perform(
				MockMvcRequestBuilders.post("/login").contentType(MediaType.APPLICATION_JSON).content(jsonString))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userName").value("tinyfish"));
	}

	@Test
	public void testLogin_invaldUsername() throws Exception {
		var username = "slimey";
		var password = "12345678";
		String jsonString = "{\r\n" + "    \"username\": \"" + username + "\",\r\n" + "    \"password\": \"" + password
				+ "\"\r\n" + "}";

		mockMvc.perform(
				MockMvcRequestBuilders.post("/login").contentType(MediaType.APPLICATION_JSON).content(jsonString))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("userNotFound"));
	}

	@Test
	public void testLogin_invaldPassword() throws Exception {
		var username = "bobcat";
		var password = "152222222";
		String jsonString = "{\r\n" + "    \"username\": \"" + username + "\",\r\n" + "    \"password\": \"" + password
				+ "\"\r\n" + "}";

		mockMvc.perform(
				MockMvcRequestBuilders.post("/login").contentType(MediaType.APPLICATION_JSON).content(jsonString))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("userNotFound"));
	}

	@Test
	@Transactional
	public void testSignUp_validInput() throws Exception {
		String json = generateUserJSON("bank200074@yahoo.com", "testUser", "12345678", "12345678", true);

		mockMvc.perform(MockMvcRequestBuilders.post("/signup").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isCreated())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userName").value("testUser"));
	}

	@Test
	public void testSignUp_invalidEmail() throws Exception {
		String json = generateUserJSON("ki.paisan_st@tni.ac.th", "testUser", "12345678", "12345678", true);

		mockMvc.perform(MockMvcRequestBuilders.post("/signup").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("emailTaken"));
	}

	@Test
	public void testSignUp_invalidUsername() throws Exception {
		String json = generateUserJSON("bank200074@yahoo.com", "bobcat", "12345678", "12345678", true);

		mockMvc.perform(MockMvcRequestBuilders.post("/signup").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("usernameTaken"));
	}

	@Test
	public void testSignUp_mismatchPassword() throws Exception {
		String json = generateUserJSON("bank200074@yahoo.com", "testUser", "12345678", "123456789a", true);

		mockMvc.perform(MockMvcRequestBuilders.post("/signup").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("passwordMismatch"));
	}

	@Test
	public void testGetPreference_validUserId() throws Exception {
		var userID = 2;

		mockMvc.perform(MockMvcRequestBuilders.get("/getPreference").param("userID", String.valueOf(userID))
				.contentType(MediaType.APPLICATION_JSON)).andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.username").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.period").exists());
	}

	@Test
	public void testGetPreference_invalidUserId() throws Exception {
		var userID = 1;

		mockMvc.perform(MockMvcRequestBuilders.get("/getPreference").param("userID", String.valueOf(userID))
				.contentType(MediaType.APPLICATION_JSON)).andExpect(MockMvcResultMatchers.status().isNotFound());
	}

	@Test
	@Transactional
	public void testUpdatePreference_validInput() throws Exception {
		String json = generatePref(Arrays.asList(2, 5, 6, 0, 3), 4, 18, "pm", true, Arrays.asList(2, 3, 4), 2);

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updatePreference").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.min").value(18))
				.andExpect(MockMvcResultMatchers.jsonPath("$.period").value("pm"))
				.andExpect(MockMvcResultMatchers.jsonPath("$.industries", containsInAnyOrder(2, 3, 4)));

	}

	@Test
	@Transactional
	public void testUpdatePreference_invalidUserID() throws Exception {
		String json = generatePref(Arrays.asList(2, 5, 6, 0, 3), 4, 18, "pm", true, Arrays.asList(2, 3, 4), 1);

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updatePreference").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isNotFound());
	}

	@Test
	@Transactional
	public void testUpdatePreference_invalidAndDupesIndustryID() throws Exception {
		String json = generatePref(Arrays.asList(2, 5, 6, 0, 3), 4, 18, "pm", true, Arrays.asList(0, 3, 4, 4, 5, 5, 5),
				2);

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updatePreference").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.industries", containsInAnyOrder(3, 4, 5)));
	}

	@Test
	@Transactional
	public void testUpdateProfile_validInput() throws Exception {
		// 1. Change all
		String json = generateProfileJSON(2, "boubakiki@tni.ac.th", "Bouba", "12345678", "newPasswordBaby");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isOk());

		// 2. Change Email
		String json2 = generateProfileJSON(2, "boubakiki@tni.ac.th", "bobcat", "", "");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json2))
				.andExpect(MockMvcResultMatchers.status().isOk());

		// 3. Change username
		String json3 = generateProfileJSON(2, "bank200074@gmail.com", "Bouba", "", "");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json3))
				.andExpect(MockMvcResultMatchers.status().isOk());

		// 4. Change password
		String json4 = generateProfileJSON(2, "bank200074@gmail.com", "bobcat", "12345678", "newPasswordBaby");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json4))
				.andExpect(MockMvcResultMatchers.status().isOk());
	}

	@Test
	@Transactional
	public void testUpdateProfile_invalidEmail() throws Exception {
		// 1. Existing email
		String json = generateProfileJSON(2, "fish@gmail.com", "Bouba", "12345678", "newPasswordBaby");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("emailTaken"));

		// 2. Wrong format
		String json2 = generateProfileJSON(2, "boubakiki.com", "bobcat", "", "");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json2))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("invalidEmailFormat"));
	}

	@Test
	@Transactional
	public void testUpdateProfile_invalidUsername() throws Exception {
		// 1. Existing username
		String json = generateProfileJSON(2, "boubakiki@tni.ac.th", "tinyfish", "12345678", "newPasswordBaby");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("usernameTaken"));

		// 2. Null username
		String json2 = generateProfileJSON(2, "boubakiki@tni.ac.th", "", "", "");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json2))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("usernameCannotBeNull"));
	}

	@Test
	@Transactional
	public void testUpdateProfile_invalidUserID() throws Exception {
		// 1. Existing username
		String json = generateProfileJSON(1, "boubakiki@tni.ac.th", "Bouba", "12345678", "newPasswordBaby");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isNotFound());

	}

	@Test
	@Transactional
	public void testUpdateProfile_invalidPassword() throws Exception {
		// 1. Mismatch password
		String json = generateProfileJSON(2, "boubakiki@tni.ac.th", "Bouba", "abcdefg", "newPasswordBaby");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("currentPasswordMismatch"));

		// 2. Wrong new password length
		String json2 = generateProfileJSON(2, "boubakiki@tni.ac.th", "Bouba", "12345678", "newPass");

		mockMvc.perform(
				MockMvcRequestBuilders.put("/updateProfile").contentType(MediaType.APPLICATION_JSON).content(json2))
				.andExpect(MockMvcResultMatchers.status().isBadRequest())
				.andExpect(MockMvcResultMatchers.content().string("newPasswordLength"));
	}


}
