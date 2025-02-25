package com.tni.project.internproject.util;

public final class StringUtil {
	
	// Dealing with text including special char and parse to double
	public static double getNum(String text) {
		if(text.contains("$")) {
			return Double.parseDouble(text.substring(1));
		}
		if(text.contains("%")) {
			return Double.parseDouble(text.substring(0, text.length()-1));
		}
		return Double.parseDouble(text);
	}
}
