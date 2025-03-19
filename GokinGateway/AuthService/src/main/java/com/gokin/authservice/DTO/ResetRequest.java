package com.gokin.authservice.DTO;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetRequest {
    private String token;
    private String password;
}
