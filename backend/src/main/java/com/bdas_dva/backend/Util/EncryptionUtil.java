package com.bdas_dva.backend.Util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {

	private static final String ALGORITHM = "AES";
	private static final String TRANSFORMATION = "AES";

	private static final String SECRET_KEY = "uNe3rCTbMjKzCL{@";

	/**
	 * Шифрует строку с использованием AES.
	 */
	public static String encrypt(String input) {
		try {
			SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
			Cipher cipher = Cipher.getInstance(TRANSFORMATION);
			cipher.init(Cipher.ENCRYPT_MODE, key);
			byte[] encryptedBytes = cipher.doFinal(input.getBytes());
			return Base64.getEncoder().encodeToString(encryptedBytes);
		} catch (Exception e) {
			throw new RuntimeException("Error while encryption!", e);
		}
	}

	/**
	 * Расшифровывает строку с использованием AES.
	 */
	public static String decrypt(String encryptedInput) {
		try {
			SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
			Cipher cipher = Cipher.getInstance(TRANSFORMATION);
			cipher.init(Cipher.DECRYPT_MODE, key);
			byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedInput));
			return new String(decryptedBytes);
		} catch (Exception e) {
			throw new RuntimeException("Error while decryption!", e);
		}
	}
}
