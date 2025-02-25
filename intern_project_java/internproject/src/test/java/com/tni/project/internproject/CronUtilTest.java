package com.tni.project.internproject;


import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.tni.project.internproject.util.CronUtil;


@SpringBootTest
public class CronUtilTest {

	
	@Test
	public void testGetCronNotation_validArgs() {
		String[] resultArray = new String[5];
		resultArray[0] = CronUtil.getCronNotation(Arrays.asList(1,2,3), 8, 10, "am");
		resultArray[1] = CronUtil.getCronNotation(Arrays.asList(1,2,3,5,6), 8, 30, "pm");
		resultArray[2] = CronUtil.getCronNotation(Arrays.asList(6,0,5,3,1), 12, 10, "am");
		resultArray[3] = CronUtil.getCronNotation(Arrays.asList(0,3,5,6), 12, 30, "pm");
		resultArray[4] = CronUtil.getCronNotation(Arrays.asList(0,1,2,3,4,5,6), 1, 59, "pm");
		
		String[] expectedArray = new String[5];
		expectedArray[0] = "0 10 8 * * 1-3";
		expectedArray[1] = "0 30 20 * * 1-3,5-6";
		expectedArray[2] = "0 10 0 * * 0-1,3,5-6";
		expectedArray[3] = "0 30 12 * * 0,3,5-6";
		expectedArray[4] = "0 59 13 * * *";
		
		assertArrayEquals(expectedArray, resultArray);
	}
	
	@Test
	public void testGetCronNotation_noDaysSelected() {
		var result = CronUtil.getCronNotation(Arrays.asList(), 8, 10, "am");
		assertEquals("0 10 8 * * 0", result);
	}
	
	@Test
	public void testGetCronNotation_invalidDaysSize() {
		var result = CronUtil.getCronNotation(Arrays.asList(), 8, 10, "am");
		assertEquals("0 10 8 * * 0", result);
	}
	

	@Test
	public void testGetDays() {
		List<Integer>[] resultArray = new ArrayList[7];
		resultArray[0] = CronUtil.getDays("0 10 8 * * 6");
		resultArray[1] = CronUtil.getDays("0 10 8 * * 1-5");
		resultArray[2] = CronUtil.getDays("0 10 8 * * 0-3,5-6");
		resultArray[3] = CronUtil.getDays("0 10 8 * * 0,4-6");
		resultArray[4] = CronUtil.getDays("0 10 8 * * 2,4,6");
		resultArray[5] = CronUtil.getDays("0 10 8 * * 0-1,3-4,6");
		resultArray[6] = CronUtil.getDays("0 10 8 * * *");
		
		List<Integer>[] expectedArray = new ArrayList[7];
		expectedArray[0] = Arrays.asList(6);
		expectedArray[1] = Arrays.asList(1,2,3,4,5);
		expectedArray[2] = Arrays.asList(0,1,2,3,5,6);
		expectedArray[3] = Arrays.asList(0,4,5,6);
		expectedArray[4] = Arrays.asList(2,4,6);
		expectedArray[5] = Arrays.asList(0,1,3,4,6);
		expectedArray[6] = Arrays.asList(0,1,2,3,4,5,6);
		
		assertArrayEquals(expectedArray, resultArray);
	}
	
	@Test
	public void testGetHour() {
		int[] resultArray = new int[5];
		resultArray[0] = CronUtil.getHour("0 10 8 * * 6");
		resultArray[1] = CronUtil.getHour("0 30 14 * * 1-5");
		resultArray[2] = CronUtil.getHour("0 40 12 * * 0-3,5-6");
		resultArray[3] = CronUtil.getHour("0 50 23 * * 0,4-6");
		resultArray[4] = CronUtil.getHour("0 10 0 * * 2,4,6");

		
		int[] expectedArray = new int[5];
		expectedArray[0] = 8;
		expectedArray[1] = 2;
		expectedArray[2] = 12;
		expectedArray[3] = 11;
		expectedArray[4] = 12;
	
		
		assertArrayEquals(expectedArray, resultArray);
	}
	
	@Test
	public void testGetMin() {
		int[] resultArray = new int[5];
		resultArray[0] = CronUtil.getMin("0 10 8 * * 6");
		resultArray[1] = CronUtil.getMin("0 38 14 * * 1-5");
		resultArray[2] = CronUtil.getMin("0 59 12 * * 0-3,5-6");
		resultArray[3] = CronUtil.getMin("0 09 23 * * 0,4-6");
		resultArray[4] = CronUtil.getMin("0 60 0 * * 2,4,6");

		
		int[] expectedArray = new int[5];
		expectedArray[0] = 10;
		expectedArray[1] = 38;
		expectedArray[2] = 59;
		expectedArray[3] = 9;
		expectedArray[4] = 0;
	
		
		assertArrayEquals(expectedArray, resultArray);
	}
	
	@Test
	public void testGetPeriod() {
		String[] resultArray = new String[5];
		resultArray[0] = CronUtil.getPeriod("0 10 8 * * 6");
		resultArray[1] = CronUtil.getPeriod("0 38 14 * * 1-5");
		resultArray[2] = CronUtil.getPeriod("0 59 12 * * 0-3,5-6");
		resultArray[3] = CronUtil.getPeriod("0 09 23 * * 0,4-6");
		resultArray[4] = CronUtil.getPeriod("0 60 0 * * 2,4,6");

		
		String[] expectedArray = new String[5];
		expectedArray[0] = "am";
		expectedArray[1] = "pm";
		expectedArray[2] = "pm";
		expectedArray[3] = "pm";
		expectedArray[4] = "am";
	
		
		assertArrayEquals(expectedArray, resultArray);
	}
	
	
	
	
	
	
	
	
}
