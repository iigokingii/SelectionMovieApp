package com.example.filmservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.filmservice.Model", "com.gokin.authservice.Model"})
public class FilmServiceApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(FilmServiceApplication.class, args);
	}
	
}
