package com.example.filmservice.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("name")
    String firstName;

    @Schema(description = "Фамилия персоны", example = "Иванов")
    @JsonProperty("surname")
    String lastName;

    @Schema(description = "Отчество персоны", example = "Иванович")
    @JsonProperty("middle_name")
    String middleName;

    @Schema(description = "Дата рождения персоны", example = "1985-06-15")
    @JsonProperty("birthday")
    LocalDate birthDate;
}
