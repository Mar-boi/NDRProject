package com.tni.project.internproject;


import java.util.List;

import com.tni.project.internproject.util.CronUtil;

public class CronTest {

	public static void main(String[] args) {

		
		String cron = "0 0 0 * * 1-3,4,6";
		List<Integer> days = CronUtil.getDays(cron);
		int hour = CronUtil.getHour(cron);
		int min = CronUtil.getMin(cron);
		String period = CronUtil.getPeriod(cron);
		String cron2 = CronUtil.getCronNotation(days, hour, min, period);
		
		System.out.println(cron2.equals(cron));
		
		System.out.println(cron);
		System.out.println(cron2);
	
	}


}
