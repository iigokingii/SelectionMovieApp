package com.gokin.authservice.DTO;

import com.gokin.authservice.Model.Role;
import com.gokin.authservice.Model.User;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpResponse {
	Long id;
	String role;
	String username;
	String email;
}
