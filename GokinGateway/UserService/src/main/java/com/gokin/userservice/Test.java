package com.gokin.userservice;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Тестовый контроллер UserService",description = "Контроллер, отвечающий за тест пользователей")
public class Test {
	@Operation(summary = "Первый тест")
	@GetMapping("/jjj")
	public String jjj(){
		return "teeeees";
	}
	
	@PostMapping("/sss")
	public String sss(){
		return "teeeees";
	}
	
}
