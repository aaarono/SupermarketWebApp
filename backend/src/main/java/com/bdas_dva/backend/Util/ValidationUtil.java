package com.bdas_dva.backend.Util;

public class ValidationUtil {

	public static boolean isValidEmail(String email) {
		String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
		return email != null && email.matches(emailRegex);
	}

	public static boolean isValidPhoneNumber(String phoneNumber) {
		String phoneRegex = "\\d{10,15}";
		return phoneNumber != null && phoneNumber.matches(phoneRegex);
	}

	public static boolean isValidPassword(String password) {
		String passwordRegex = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$";
		return password != null && password.matches(passwordRegex);
	}
}