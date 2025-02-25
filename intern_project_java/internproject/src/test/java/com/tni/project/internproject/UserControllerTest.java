package com.tni.project.internproject;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.assertj.MockMvcTester.MockMvcRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;



@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;
	
	@Test
	public void testLogin_validUser() throws Exception {
		var username = "tinyfish";
		var password = "12345678";
		String jsonString = "{\r\n"
				+ "    \"username\": \""+ username + "\",\r\n"
				+ "    \"password\": \""+ password + "\"\r\n"
				+ "}";
	
		mockMvc.perform(
				MockMvcRequestBuilders.post("/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(jsonString)
				)
		.andExpect(MockMvcResultMatchers.status().isOk())
		.andExpect(MockMvcResultMatchers.jsonPath("$.userName").value("tinyfish"));
	}
	
	@Test
	public void testLogin_invaldUsername() throws Exception {
		var username = "slimey";
		var password = "12345678";
		String jsonString = "{\r\n"
				+ "    \"username\": \""+ username + "\",\r\n"
				+ "    \"password\": \""+ password + "\"\r\n"
				+ "}";
	
		mockMvc.perform(
				MockMvcRequestBuilders.post("/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(jsonString)
				)
		.andExpect(MockMvcResultMatchers.status().isBadRequest())
		.andExpect(MockMvcResultMatchers.content().string("Cannot find user"));
	}
	
	@Test
	public void testLogin_invaldPassword() throws Exception {
		var username = "bobcat";
		var password = "152222222";
		String jsonString = "{\r\n"
				+ "    \"username\": \""+ username + "\",\r\n"
				+ "    \"password\": \""+ password + "\"\r\n"
				+ "}";
	
		mockMvc.perform(
				MockMvcRequestBuilders.post("/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(jsonString)
				)
		.andExpect(MockMvcResultMatchers.status().isBadRequest())
		.andExpect(MockMvcResultMatchers.content().string("Cannot find user"));
	}
}
