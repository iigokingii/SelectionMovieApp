package com.example.filmservice.Model;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "liked_film")
public class LikedFilm {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "liked_film_id_seq")
	@SequenceGenerator(name = "liked_film_id_seq", sequenceName = "liked_film_id_seq", allocationSize = 1)
	private Long id;
	@Column(name = "film_id", nullable = false)
	private Long filmId;
	@Column(name = "user_id", nullable = false)
	private Long userId;
}
