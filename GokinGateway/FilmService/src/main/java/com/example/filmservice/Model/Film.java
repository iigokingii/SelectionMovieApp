package com.example.filmservice.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity()
@Table(name = "film")
public class Film {
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "title", nullable = false)
	private String title;
	@Column(name = "original_title", nullable = false)
	private String originalTitle;
	@Column(name = "poster", nullable = false, length = 50000)
	private String poster;
	@Column(name = "year_of_posting", nullable = false)
	private Date yearOfPosting;
	@Column(name = "country_produced", nullable = false)
	private String countryProduced;
	@Column(name = "description", nullable = false, length = 1024)
	private String description;
	@Column(name = "kinopoisk_rating", nullable = false)
	private float kinopoiskRating;
	@Column(name = "IMDb_rating", nullable = false)
	private float IMDBRating;
	@Column(name = "total_box_office", nullable = false)
	private float totalBoxOffice;
	@Column(name = "age", nullable = false)
	private int Age;
	@Column(name = "duration", nullable = false)
	private String duration;
	@ManyToMany
	@JoinTable(
			name = "film_actor",
			joinColumns = @JoinColumn(name="film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "actor_id", nullable = false)
	)
	@JsonManagedReference
	private List<Actor> actors;
	@ManyToMany
	@JoinTable(
			name="film_director",
			joinColumns = @JoinColumn(name = "film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "director_id", nullable = false)
	)
	@JsonManagedReference
	private List<Director> directors;
	@ManyToMany
	@JoinTable(
			name = "film_genre",
			joinColumns = @JoinColumn(name = "film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "genre_id", nullable = false)
	)
	@JsonManagedReference
	private List<Genre>genres;
	@ManyToMany
	@JoinTable(
			name = "film_musician",
			joinColumns = @JoinColumn(name = "film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "musician_id", nullable = false)
	)
	@JsonManagedReference
	private List<Musician>musicians;
	@ManyToMany
	@JoinTable(
			name = "film_operator",
			joinColumns = @JoinColumn(name = "film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "operator_id", nullable = false)
	)
	@JsonManagedReference
	private List<Operator>operators;
	@ManyToMany
	@JoinTable(
			name = "film_producer",
			joinColumns = @JoinColumn(name="film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name="producer_id", nullable = false)
	)

	@JsonManagedReference
	private List<Producer>producers;
	@ManyToMany
	@JoinTable(
			name = "film_screen_writer",
			joinColumns = @JoinColumn(name = "film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "screen_writer_id", nullable = false)
	)

	@JsonManagedReference
	private List<ScreenWriter>screenWriters;

	@OneToMany
	@JoinTable(
			name = "film_comment",
			joinColumns = @JoinColumn(name = "film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "comment_id", nullable = false)
	)
	@JsonManagedReference
	private List<Comment> comments;
}
