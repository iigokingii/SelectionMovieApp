package com.example.filmservice.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "producer")
//продюсер
public class Producer {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "producer_id_seq")
	@SequenceGenerator(name = "producer_id_seq", sequenceName = "producer_id_seq", allocationSize = 1)
	private Long id;
	@Column(name = "name", nullable = false)
	private String name;
	@Column(name = "surname", nullable = false)
	private String surname;
	@Column(name = "middle_name", nullable = false)
	private String middleName;
	@Column(name = "birthday", nullable = false)
	private LocalDate birthday;
	@ManyToMany(mappedBy = "producers")
	@JsonBackReference
	private List<Film> films;
}
