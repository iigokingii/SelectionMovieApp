package com.gokin.authservice.Config;

import com.gokin.authservice.Model.Role;
import com.gokin.authservice.Model.User;
import com.gokin.authservice.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initAdminUser() {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@mail.ru")
                        .role(Role.ROLE_ADMIN)
                        .avatar("http://localhost:4566/gokin-bucket/6e51ae33-773c-43d5-8644-33cc693c3de8-default_user_avatar.png")
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created with username: admin and password: admin");
            }
        };
    }
}
