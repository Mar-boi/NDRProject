package com.tni.project.internproject.util;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public final class CronUtil {
	
	
	public CronUtil() {
		
	}
	public static String getCronNotation(List<Integer> days, int hour, int min, String period) {
		String weekdays = getDaysCronNotation(days);
		int hourCorrection = hour;
		
		if ("pm".equals(period) && hour != 12) {
		    hourCorrection += 12;
		} else if ("am".equals(period) && hour == 12) {
		    hourCorrection -= 12;
		}
		
		return "0 " + min + " " + hourCorrection + " * * " + weekdays;
	}
	
	public static String getDaysCronNotation(List<Integer> days) {
		
		Collections.sort(days);
	
		// If no days are selected, return "0"
		if (days.size() == 0) {
			return "0";
		}
		
        // If all days are selected, return "*"
        if (days.size() >= 7) {
            return "*";
        }

        // If only one day, return the number itself
        if (days.size() == 1) {
            return String.valueOf(days.get(0));
        }

        StringBuilder cronNotation = new StringBuilder();
        int start = days.get(0);  // start of the range
        int end = days.get(0);    // end of the range

        for (int i = 1; i < days.size(); i++) {
            if (days.get(i) - end == 1) {
                // Continuation of the range
                end = days.get(i);
            } else {
                // Close the previous range and add a new one
                appendRange(cronNotation, start, end);
                cronNotation.append(",");
                start = end = days.get(i);
            }
        }

        // Append the final range
        appendRange(cronNotation, start, end);

        return cronNotation.toString();
    }

    // Helper method to append the range to the StringBuilder
	public static void appendRange(StringBuilder cronNotation, int start, int end) {
        if (start == end) {
            cronNotation.append(start);
        } else {
            cronNotation.append(start).append("-").append(end);
        }
    }
    
	public static int getMin (String cron) {
		String minString = decomposeCron(cron)[1];
		
		try {
	    	return Integer.parseInt(minString)%60;
		} catch (NumberFormatException e) {
			return 0;
		}
    
    }
    
	public static int getHour (String cron) {
		
		try {
			int hour = Integer.parseInt(decomposeCron(cron)[2]);
			if(hour > 12) {
	    		hour-=12;
	    	} else if(hour == 0) {
	    		hour+=12;
	    	}
	    	
	    	return hour;
		} catch (NumberFormatException e) {
			return 0; // might change to 12!
		}
    	
    	
    }
    
	public static String getPeriod(String cron) {
		try {
			int hour = Integer.parseInt(decomposeCron(cron)[2]);
	    	if(hour >=12) {
	    		return "pm";
	    	} else {
	    		return "am";
	    	}
		} catch (NumberFormatException e) {
			return "am";
		}
    	
    }
    
	public static List<Integer> getDays(String cron) {
    	String days= decomposeCron(cron)[5];	
    	List<Integer> daysList = new ArrayList<Integer>();
    	
    	 if(days.equals("*")) {
 	    	return Arrays.asList(0,1,2,3,4,5,6);
 	    }
    	
    	 boolean isInRange = false;
    	    int startDay = -1;
    	    
    	    // Iterate through each character in the days string
    	    for (int i = 0; i < days.length(); i++) {
    	        char currentChar = days.charAt(i);
    	        
    	        // Skip commas (we don't need to handle them)
    	        if (currentChar == ',') continue;

    	        // If we encounter a hyphen, we are starting a range
    	        if (currentChar == '-') {
    	            isInRange = true;
    	            continue;  // skip the hyphen itself
    	        }

    	        // Convert current day character to integer
    	        int currentDay = Character.getNumericValue(currentChar);
    	        
    	        // If we're in a range, add the intermediate days
    	        if (isInRange) {
    	            while (startDay < currentDay - 1) {
    	                daysList.add(++startDay);
    	            }
    	            daysList.add(currentDay);
    	            isInRange = false;
    	        } else {
    	            // Add individual day if not in a range
    	            if (startDay != -1 && startDay != currentDay) {
    	                daysList.add(currentDay);
    	            } else {
    	                daysList.add(currentDay);
    	            }
    	        }

    	        startDay = currentDay;
    	    }

    	    return daysList;
    }
    
	public static String[] decomposeCron(String cron) {
    	String[] cronArray = cron.split(" ");
    	return cronArray;
    }
   
}
