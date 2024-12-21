package com.example.filmservice.Service;

import com.example.filmservice.DTO.*;
import com.example.filmservice.Model.*;
import com.example.filmservice.Repository.*;
import com.gokin.authservice.Model.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FilmService {
	@Value("${authservice.base-url}")
	private String authServiceBaseUrl;
	@Autowired FilmRepository filmRepository;
	@Autowired ActorRepository actorRepository;
	@Autowired DirectorRepository directorRepository;
	@Autowired GenreRepository genreRepository;
	@Autowired MusicianRepository musicianRepository;
	@Autowired OperatorRepository operatorRepository;
	@Autowired ProducerRepository producerRepository;
	@Autowired ScreenWriterRepository screenWriterRepository;
	@Autowired CommentRepository commentRepository;
	@Autowired RestTemplate restTemplate;
	@Autowired HttpServletRequest request;
	public MovieOptionsDTO GetOptions(){
		return MovieOptionsDTO.builder()
				.Actors(actorRepository.findAll())
				.Directors(directorRepository.findAll())
				.Genres(genreRepository.findAll())
				.Musicians(musicianRepository.findAll())
				.Operators(operatorRepository.findAll())
				.ScreenWriters(screenWriterRepository.findAll())
				.Producers(producerRepository.findAll())
				.build();
	}

	public List<Film> GetFilms(){
		return filmRepository.findAll();
	}

	public Film GetFilm(Long filmId){
		return filmRepository.findById(filmId)
				.orElseThrow(() -> new EntityNotFoundException("Film not found with ID: " + filmId));
	}

	public Film AddFilm(FilmDTO film){
		var filmGenerated = Film.builder()
				.Age(film.getAge())
				.description(film.getDescription())
				.countryProduced(film.getCountry_produced())
				.poster(film.getPoster())
				.title(film.getTitle())
				.duration(film.getDuration())
				.IMDBRating(film.getImdb_rating())
				.kinopoiskRating(film.getKinopoisk_rating())
				.originalTitle(film.getOriginal_title())
				.yearOfPosting(film.getYear_of_posting())
				.totalBoxOffice(film.getTotal_box_office())
				.actors(List.of())
				.directors(List.of())
				.genres(List.of())
				.musicians(List.of())
				.operators(List.of())
				.producers(List.of())
				.screenWriters(List.of())
				.comments(List.of())
				.build();
		return filmRepository.save(filmGenerated);
	}

	public Comment AddComment(Long filmId, CommentDTO commentDTO) {
		Film film = filmRepository.findById(filmId)
				.orElseThrow(() -> new EntityNotFoundException("Film not found"));

		String url = authServiceBaseUrl + "/api/auth/users/user/" + commentDTO.getUserId();

		// Извлекаем куки из запроса пользователя
		String cookies = extractCookies();

		HttpHeaders headers = new HttpHeaders();
		headers.add("Cookie", cookies);

		HttpEntity<String> entity = new HttpEntity<>(headers);

		User user;
		try {
			ResponseEntity<User> response = restTemplate.exchange(
					url,
					HttpMethod.GET,
					entity,
					User.class
			);
			user = response.getBody();
		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch user details", e);
		}

		var comment = Comment.builder()
				.message(commentDTO.getComment())
				.dateOfPosting(LocalDate.now())
				.user(user)
				.film(film)
				.build();

		comment = commentRepository.save(comment);
		film.getComments().add(comment);
		filmRepository.save(film);

		return comment;
	}

	public Genre AddGenre(Long filmId, GenreDTO genreDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			Optional<Genre> existingGenre = genreRepository.findByName(genreDTO.getName());

			Genre genre = existingGenre.orElseGet(() -> {
				var newGenre = Genre.builder()
						.name(genreDTO.getName())
						.description(genreDTO.getDescription())
						.build();
				return genreRepository.save(newGenre);
			});

			if (!film.get().getGenres().contains(genre)) {
				film.get().getGenres().add(genre);
				filmRepository.save(film.get());
				return genre;
			}
		}

		return null;
	}

	public Director AddDirector(Long filmId, PersonDTO directorDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			Optional<Director> existingDirector = directorRepository.findByNameAndSurnameAndMiddleNameAndBirthday(
					directorDTO.getFirstName(), directorDTO.getLastName(), directorDTO.getMiddleName(), directorDTO.getBirthDate());

			Director director = existingDirector.orElseGet(() -> {
				var newDirector = Director.builder()
						.name(directorDTO.getFirstName())
						.surname(directorDTO.getLastName())
						.middleName(directorDTO.getMiddleName())
						.birthday(directorDTO.getBirthDate())
						.build();
				return directorRepository.save(newDirector);
			});

			if (!film.get().getDirectors().contains(director)) {
				film.get().getDirectors().add(director);
				filmRepository.save(film.get());
				return director;
			}
		}

		return null;
	}

	public Actor AddActor(Long filmId, PersonDTO actorDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			Optional<Actor> existingActor = actorRepository.findByNameAndSurnameAndMiddleNameAndBirthday(
					actorDTO.getFirstName(), actorDTO.getLastName(), actorDTO.getMiddleName(), actorDTO.getBirthDate());

			Actor actor = existingActor.orElseGet(() -> {
				var newActor = Actor.builder()
						.name(actorDTO.getFirstName())
						.surname(actorDTO.getLastName())
						.middleName(actorDTO.getMiddleName())
						.birthday(actorDTO.getBirthDate())
						.build();
				return actorRepository.save(newActor);
			});

			if (!film.get().getActors().contains(actor)) {
				film.get().getActors().add(actor);
				filmRepository.save(film.get());
				return actor;
			}
		}

		return null;
	}

	public ScreenWriter AddScreenwriter(Long filmId, PersonDTO screenwriterDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			Optional<ScreenWriter> existingScreenwriter = screenWriterRepository.findByNameAndSurnameAndMiddleNameAndBirthday(
					screenwriterDTO.getFirstName(), screenwriterDTO.getLastName(), screenwriterDTO.getMiddleName(), screenwriterDTO.getBirthDate());

			ScreenWriter screenwriter = existingScreenwriter.orElseGet(() -> {
				var newScreenwriter = ScreenWriter.builder()
						.name(screenwriterDTO.getFirstName())
						.surname(screenwriterDTO.getLastName())
						.middleName(screenwriterDTO.getMiddleName())
						.birthday(screenwriterDTO.getBirthDate())
						.build();
				return screenWriterRepository.save(newScreenwriter);
			});

			if (!film.get().getScreenWriters().contains(screenwriter)) {
				film.get().getScreenWriters().add(screenwriter);
				filmRepository.save(film.get());
				return screenwriter;
			}
		}

		return null;
	}

	public Operator AddOperator(Long filmId, PersonDTO operatorDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			Optional<Operator> existingOperator = operatorRepository.findByNameAndSurnameAndMiddleNameAndBirthday(
					operatorDTO.getFirstName(), operatorDTO.getLastName(), operatorDTO.getMiddleName(), operatorDTO.getBirthDate());

			Operator operator = existingOperator.orElseGet(() -> {
				var newOperator = Operator.builder()
						.name(operatorDTO.getFirstName())
						.surname(operatorDTO.getLastName())
						.middleName(operatorDTO.getMiddleName())
						.birthday(operatorDTO.getBirthDate())
						.build();
				return operatorRepository.save(newOperator);
			});

			if (!film.get().getOperators().contains(operator)) {
				film.get().getOperators().add(operator);
				filmRepository.save(film.get());
				return operator;
			}
		}

		return null;
	}

	public Musician AddMusician(Long filmId, PersonDTO musicianDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			Optional<Musician> existingMusician = musicianRepository.findByNameAndSurnameAndMiddleNameAndBirthday(
					musicianDTO.getFirstName(), musicianDTO.getLastName(), musicianDTO.getMiddleName(), musicianDTO.getBirthDate());

			Musician musician = existingMusician.orElseGet(() -> {
				var newMusician = Musician.builder()
						.name(musicianDTO.getFirstName())
						.surname(musicianDTO.getLastName())
						.middleName(musicianDTO.getMiddleName())
						.birthday(musicianDTO.getBirthDate())
						.build();
				return musicianRepository.save(newMusician);
			});

			if (!film.get().getMusicians().contains(musician)) {
				film.get().getMusicians().add(musician);
				filmRepository.save(film.get());
				return musician;
			}
		}

		return null;
	}

	public Film updateFilm(Long filmId, FilmDTO filmDetails) {
		Optional<Film> optionalFilm = filmRepository.findById(filmId);

		Film existingFilm = optionalFilm.get();

		existingFilm.setTitle(filmDetails.getTitle());
		existingFilm.setOriginalTitle(filmDetails.getOriginal_title());
		existingFilm.setAge(filmDetails.getAge());
		existingFilm.setIMDBRating(filmDetails.getImdb_rating());
		existingFilm.setKinopoiskRating(filmDetails.getKinopoisk_rating());
		existingFilm.setTotalBoxOffice(filmDetails.getTotal_box_office());
		existingFilm.setYearOfPosting(filmDetails.getYear_of_posting());
		existingFilm.setCountryProduced(filmDetails.getCountry_produced());
		existingFilm.setDescription(filmDetails.getDescription());
		existingFilm.setDuration(filmDetails.getDuration());
		existingFilm.setPoster(filmDetails.getPoster());

		return filmRepository.save(existingFilm);
	}

	public Comment UpdateComment(Long filmId, Long commentId, CommentDTO comment) {
		Optional<Film> filmOptional = filmRepository.findById(filmId);
		Optional<Comment> commentOptional = commentRepository.findById(commentId);
		if (!filmOptional.isPresent() || !commentOptional.isPresent()) {
			return null;
		}

		Film existingFilm = filmOptional.get();
		Comment existingComment = commentOptional.get();
		existingComment.setMessage(comment.getComment());
		commentRepository.save(existingComment);
		filmRepository.save(existingFilm);
		return existingComment;
	}

	public void DeleteFilm(Long filmId) {
		Optional<Film> deletedFilm = filmRepository.findById(filmId);

		if (deletedFilm.isPresent()) {
			filmRepository.deleteById(filmId);
		}
	}

	public Genre DeleteGenreFromMovie(Long filmId, Long genreId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Genre> deleteGenre = genreRepository.findById(genreId);
			if (deleteGenre.isPresent()) {
				film.get().getGenres().remove(deleteGenre.get());
				filmRepository.save(film.get());

				if (filmRepository.countByGenres(deleteGenre.get()) == 0) {
					genreRepository.delete(deleteGenre.get());
					return deleteGenre.get();
				}
				return deleteGenre.get();
			}
		}
		return null;
	}

	public Director DeleteDirectorFromMovie(Long filmId, Long directorId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Director> deleteDirector = directorRepository.findById(directorId);
			if (deleteDirector.isPresent()) {
				film.get().getDirectors().remove(deleteDirector.get());
				filmRepository.save(film.get());

				if (filmRepository.countByDirectors(deleteDirector.get()) == 0) {
					directorRepository.delete(deleteDirector.get());
					return deleteDirector.get();
				}
				return deleteDirector.get();
			}
		}
		return null;
	}

	public Actor DeleteActorFromMovie(Long filmId, Long actorId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Actor> deleteActor = actorRepository.findById(actorId);
			if (deleteActor.isPresent()) {
				film.get().getActors().remove(deleteActor.get());
				filmRepository.save(film.get());

				if (filmRepository.countByActors(deleteActor.get()) == 0) {
					actorRepository.delete(deleteActor.get());
					return deleteActor.get();
				}
				return deleteActor.get();
			}
		}
		return null;
	}

	public ScreenWriter DeleteScreenwriterFromMovie(Long filmId, Long screenwriterId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<ScreenWriter> deleteScreenwriter = screenWriterRepository.findById(screenwriterId);
			if (deleteScreenwriter.isPresent()) {
				film.get().getScreenWriters().remove(deleteScreenwriter.get());
				filmRepository.save(film.get());

				if (filmRepository.countByScreenWriters(deleteScreenwriter.get()) == 0) {
					screenWriterRepository.delete(deleteScreenwriter.get());
					return deleteScreenwriter.get();
				}
				return deleteScreenwriter.get();
			}
		}
		return null;
	}

	public Operator DeleteOperatorFromMovie(Long filmId, Long operatorId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Operator> deleteOperator = operatorRepository.findById(operatorId);
			if (deleteOperator.isPresent()) {
				film.get().getOperators().remove(deleteOperator.get());
				filmRepository.save(film.get());

				if (filmRepository.countByOperators(deleteOperator.get()) == 0) {
					operatorRepository.delete(deleteOperator.get());
					return deleteOperator.get();
				}
				return deleteOperator.get();
			}
		}
		return null;
	}

	public Musician DeleteMusicianFromMovie(Long filmId, Long musicianId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Musician> deleteMusician = musicianRepository.findById(musicianId);
			if (deleteMusician.isPresent()) {
				film.get().getMusicians().remove(deleteMusician.get());
				filmRepository.save(film.get());

				if (filmRepository.countByMusicians(deleteMusician.get()) == 0) {
					musicianRepository.delete(deleteMusician.get());
					return deleteMusician.get();
				}
				return deleteMusician.get();
			}
		}
		return null;
	}

	public void DeleteComment(Long filmId, Long commentId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Comment> deleteComment = commentRepository.findById(commentId);
			if (deleteComment.isPresent()) {
				film.get().getComments().remove(deleteComment.get());
				filmRepository.save(film.get());
				commentRepository.delete(deleteComment.get());
			}
		}
	}

	public Producer AddProducer(Long filmId, PersonDTO producerDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			Optional<Producer> existingProducer = producerRepository.findByNameAndSurnameAndMiddleNameAndBirthday(
					producerDTO.getFirstName(), producerDTO.getLastName(), producerDTO.getMiddleName(), producerDTO.getBirthDate());

			Producer producer = existingProducer.orElseGet(() -> {
				var newProducer = Producer.builder()
						.name(producerDTO.getFirstName())
						.surname(producerDTO.getLastName())
						.middleName(producerDTO.getMiddleName())
						.birthday(producerDTO.getBirthDate())
						.build();
				return producerRepository.save(newProducer);
			});

			if (!film.get().getProducers().contains(producer)) {
				film.get().getProducers().add(producer);
				filmRepository.save(film.get());
				return producer;
			}
		}

		return null;
	}

	public Producer DeleteProducerFromMovie(Long filmId, Long producerId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Producer> deleteProducer = producerRepository.findById(producerId);
			if (deleteProducer.isPresent()) {
				film.get().getProducers().remove(deleteProducer.get());
				filmRepository.save(film.get());

				if (filmRepository.countByProducers(deleteProducer.get()) == 0) {
					producerRepository.delete(deleteProducer.get());
					return deleteProducer.get();
				}
				return deleteProducer.get();
			}
		}
		return null;
	}


	private String extractCookies() {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return null;
		}
		return Arrays.stream(cookies)
				.map(cookie -> cookie.getName() + "=" + cookie.getValue())
				.collect(Collectors.joining("; "));
	}
}

