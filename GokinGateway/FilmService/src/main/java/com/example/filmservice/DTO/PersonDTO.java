package com.example.filmservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для информации о персоне (например, актере, режиссере и т. д.)")
public class PersonDTO {
    @Schema(description = "Имя персоны", example = "Иван")
    String firstName;

    @Schema(description = "Фамилия персоны", example = "Иванов")
    String lastName;

    @Schema(description = "Отчество персоны", example = "Иванович")
    String middleName;

    @Schema(description = "Дата рождения персоны", example = "1985-06-15")
    LocalDate birthDate;
}
