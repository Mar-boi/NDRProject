package com.tni.project.internproject;


import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class CronTest {

	public static void main(String[] args) {
		List<Integer> days = Arrays.asList(1, 2,4, 5 ,6, 0);
		
		Collections.sort(days);
		
		System.out.println(days);
		
		System.out.println(getCronNotation(days));
	}

	private static String getCronNotation(List<Integer> days) {
        // If all days are selected, return "*"
        if (days.size() == 7) {
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
    private static void appendRange(StringBuilder cronNotation, int start, int end) {
        if (start == end) {
            cronNotation.append(start);
        } else {
            cronNotation.append(start).append("-").append(end);
        }
    }

}
