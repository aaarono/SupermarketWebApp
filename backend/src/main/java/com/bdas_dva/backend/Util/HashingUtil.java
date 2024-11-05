package com.bdas_dva.backend.Util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class HashingUtil {

	private static final BCryptPasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();

	/**
	 * Хэширует пароль с использованием BCrypt.
	 */
	public static String hashPassword(String password) {
		return bcryptEncoder.encode(password);
	}

	/**
	 * Проверяет, соответствует ли пароль зашифрованному значению.
	 */
	public static boolean checkPassword(String rawPassword, String encodedPassword) {
		return bcryptEncoder.matches(rawPassword, encodedPassword);
	}

	/**
	 * Хэширует строку (например, email или номер телефона) с использованием SHA-256.
	 */
	public static String hashString(String input) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
			return Base64.getEncoder().encodeToString(hash);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("Error while creating hash", e);
		}
	}
}
