package com.bdas_dva.backend.Util;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtil {

	private static final ObjectMapper objectMapper = new ObjectMapper();

	public static String toJson(Object object) throws IOException {
		return objectMapper.writeValueAsString(object);
	}

	public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
		return objectMapper.readValue(json, clazz);
	}
}
