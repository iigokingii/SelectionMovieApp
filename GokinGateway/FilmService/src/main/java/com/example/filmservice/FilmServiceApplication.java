package com.example.filmservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//todo should be removed
//@SpringBootApplication
//@EntityScan(basePackages = {"com.example.filmservice.Model", "com.gokin.authservice.Model"})
@SpringBootApplication
@EntityScan(basePackages = {"com.example.filmservice.Model", "com.gokin.authservice.Model"})
@EnableJpaRepositories(basePackages = {"com.example.filmservice.Repository", "com.gokin.authservice.Repository"})
public class FilmServiceApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(FilmServiceApplication.class, args);
	}
	
}
