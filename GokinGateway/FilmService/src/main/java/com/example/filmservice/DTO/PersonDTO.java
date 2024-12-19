package com.example.filmservice.DTO;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    String firstName;
    String lastName;
    String middleName;
    LocalDate birthDate;
}