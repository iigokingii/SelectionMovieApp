package com.example.filmservice.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
	@Column(name = "title")
	private String title;
	@Column(name = "original_title")
	private String originalTitle;
	@Column(name = "poster")
	private String poster;
	@Column(name = "year_of_posting")
	private Date yearOfPosting;
	@Column(name = "country_produced")
	private String countryProduced;
	@Column(name = "description", length = 2000)
	private String description;
	@Column(name = "kinopoisk_rating")
	private float kinopoiskRating;
	@Column(name = "gokin_rating")
	private float gokinRating;
	@Column(name = "voice_number")
	private float voiceNumber;
	//TODO add budget to all adding screens including api kinopoisk
	@Column(name = "budget")
	private float budget;
	@Column(name = "youtube_url")
	private String youtubeUrl;
	@Column(name = "IMDb_rating")
	private float IMDBRating;
	@Column(name = "total_box_office")
	private float totalBoxOffice;
	@Column(name = "age")
	private int Age;
	@Column(name = "duration")
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

	@OneToMany
	@JoinTable(
			name = "film_rating",
			joinColumns = @JoinColumn(name = "film_id", nullable = false),
			inverseJoinColumns = @JoinColumn(name = "rating_id", nullable = false)
	)
	@JsonManagedReference
	@JsonIgnore
	private List<Rating> ratings;
}
