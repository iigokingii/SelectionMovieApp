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
@Table(name = "musician")
//композитор
public class Musician {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "musician_id_seq")
	@SequenceGenerator(name = "musician_id_seq", sequenceName = "musician_id_seq", allocationSize = 1)
	private Long id;
	@Column(name = "name")
	private String name;
	@Column(name = "surname")
	private String surname;
	@Column(name = "middle_name")
	private String middleName;
	@Column(name = "birthday")
	private LocalDate birthday;
	@ManyToMany(mappedBy = "musicians")
	@JsonBackReference
	private List<Film> films;
}
