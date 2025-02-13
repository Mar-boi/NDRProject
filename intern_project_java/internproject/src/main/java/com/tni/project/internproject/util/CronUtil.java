package com.tni.project.internproject.util;


import java.util.List;

public class CronUtil {
	private List<Integer> days;
	// String hour
	// String min
	
	public CronUtil(List<Integer> days) {
		this.days = days;
	}
	
	private String getCronNotation() {
		String weekdays = getDaysCronNotation();
		return "0 " + "min" + " " + "hour" + " * * " + weekdays;
	}
	
	private String getDaysCronNotation() {
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
    private void appendRange(StringBuilder cronNotation, int start, int end) {
        if (start == end) {
            cronNotation.append(start);
        } else {
            cronNotation.append(start).append("-").append(end);
        }
    }
}
