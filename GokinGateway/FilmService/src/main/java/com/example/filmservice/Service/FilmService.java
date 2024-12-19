package com.example.filmservice.Service;

import com.example.filmservice.DTO.CommentDTO;
import com.example.filmservice.DTO.FilmDTO;
import com.example.filmservice.DTO.GenreDTO;
import com.example.filmservice.DTO.PersonDTO;
import com.example.filmservice.Model.*;
import com.example.filmservice.Repository.*;
import com.gokin.authservice.Model.User;
import com.gokin.authservice.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class FilmService {
	@Autowired
	FilmRepository filmRepository;
	@Autowired
	ActorRepository actorRepository;
	@Autowired
	DirectorRepository directorRepository;
	@Autowired
	GenreRepository genreRepository;
	@Autowired
	MusicianRepository musicianRepository;
	@Autowired
	OperatorRepository operatorRepository;
	@Autowired
	ProducerRepository producerRepository;
	@Autowired
	ScreenWriterRepository screenWriterRepository;
	@Autowired
	CommentRepository commentRepository;
	@Autowired
	UserRepository userRepository;

	public List<Film> GetFilms(){
		return filmRepository.findAll();
	}

	public Film GetFilm(Long filmId){
		return filmRepository.findById(filmId)
				.orElseThrow(() -> new EntityNotFoundException("Film not found with ID: " + filmId));
	}

	public Film AddFilm(FilmDTO film){
		var actor = Actor.builder()
				.name("sda")
				.middleName("ss")
				//.avatar(new byte[]{12})
				.birthday(LocalDate.now())
				.surname("qwe")
				.build();
		actorRepository.save(actor);

		var director = Director.builder()
				.name("sda")
				.middleName("ss")
				//.avatar(new byte[]{12})
				.birthday(LocalDate.now())
				.surname("qwe")
				.build();
		directorRepository.save(director);

		var genre = Genre.builder()
				.name("Boevik")
				.description("zxczxczxc")
				.build();
		genreRepository.save(genre);

		var musician = Musician.builder()
				.name("sda")
				.middleName("ss")
				//.avatar(new byte[]{12})
				.birthday(LocalDate.now())
				.surname("qwe")
				.build();
		musicianRepository.save(musician);

		var operator = Operator.builder()
				.name("sda")
				.middleName("ss")
				//.avatar(new byte[]{12})
				.birthday(LocalDate.now())
				.surname("qwe")
				.build();
		operatorRepository.save(operator);

		var producer = Producer.builder()
				.name("sda")
				.middleName("ss")
				//.avatar(new byte[]{12})
				.birthday(LocalDate.now())
				.surname("qwe")
				.build();
		producerRepository.save(producer);

		var screenWriter = ScreenWriter.builder()
				.name("sda")
				.middleName("ss")
				//.avatar(new byte[]{12})
				.birthday(LocalDate.now())
				.surname("qwe")
				.build();
		screenWriterRepository.save(screenWriter);

		var comment = Comment.builder()
				.message("sdaasdasdasdasd")
				.dateOfPosting(LocalDate.now())
				.build();
		commentRepository.save(comment);

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

		Comment comment = new Comment();
		comment.setMessage(commentDTO.getComment());
		comment.setDateOfPosting(LocalDate.now());
		comment.setFilm(film);
		comment.setUser();
		comment = commentRepository.save(comment);
		//comment.setUser(new User());
		film.getComments().add(comment);
		filmRepository.save(film);
		return comment;
	}

	public Genre AddGenre (Long filmId, GenreDTO genreDTO) {
		var film = filmRepository.findById(filmId);
		if(film.isPresent()){
			var genre = Genre.builder()
					.name(genreDTO.getName())
					.description(genreDTO.getDescription())
					.build();
			var savedgenre = genreRepository.save(genre);
			film.get().getGenres().add(savedgenre);
			filmRepository.save(film.get());
			return savedgenre;
		}
		return null;
	}

	public Director AddDirector(Long filmId, PersonDTO directorDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			var director = Director.builder()
					.name(directorDTO.getFirstName())
					.surname(directorDTO.getLastName())
					.middleName(directorDTO.getMiddleName())
					.birthday(directorDTO.getBirthDate())
					.build();
			var savedDirector = directorRepository.save(director);
			film.get().getDirectors().add(savedDirector);
			filmRepository.save(film.get());
			return savedDirector;
		}
		return null;
	}

	public Actor AddActor(Long filmId, PersonDTO actorDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			var actor = Actor.builder()
					.name(actorDTO.getFirstName())
					.surname(actorDTO.getLastName())
					.middleName(actorDTO.getMiddleName())
					.birthday(actorDTO.getBirthDate())
					.build();
			var savedActor = actorRepository.save(actor);
			film.get().getActors().add(savedActor);
			filmRepository.save(film.get());
			return savedActor;
		}
		return null;
	}

	public ScreenWriter AddScreenwriter(Long filmId, PersonDTO screenwriterDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			var screenwriter = ScreenWriter.builder()
					.name(screenwriterDTO.getFirstName())
					.surname(screenwriterDTO.getLastName())
					.middleName(screenwriterDTO.getMiddleName())
					.birthday(screenwriterDTO.getBirthDate())
					.build();
			var savedScreenwriter = screenWriterRepository.save(screenwriter);
			film.get().getScreenWriters().add(savedScreenwriter);
			filmRepository.save(film.get());
			return savedScreenwriter;
		}
		return null;
	}

	public Operator AddOperator(Long filmId, PersonDTO operatorDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			var operator = Operator.builder()
					.name(operatorDTO.getFirstName())
					.surname(operatorDTO.getLastName())
					.middleName(operatorDTO.getMiddleName())
					.birthday(operatorDTO.getBirthDate())
					.build();
			var savedOperator = operatorRepository.save(operator);
			film.get().getOperators().add(savedOperator);
			filmRepository.save(film.get());
			return savedOperator;
		}
		return null;
	}

	public Musician AddMusician(Long filmId, PersonDTO musicianDTO) {
		var film = filmRepository.findById(filmId);
		if (film.isPresent()) {
			var musician = Musician.builder()
					.name(musicianDTO.getFirstName())
					.surname(musicianDTO.getLastName())
					.middleName(musicianDTO.getMiddleName())
					.birthday(musicianDTO.getBirthDate())
					.build();
			var savedMusician = musicianRepository.save(musician);
			film.get().getMusicians().add(savedMusician);
			filmRepository.save(film.get());
			return savedMusician;
		}
		return null;
	}


	public void DeleteFilm(Long filmId) {
		Optional<Film> deletedFilm = filmRepository.findById(filmId);

		if (deletedFilm.isPresent()) {
			filmRepository.deleteById(filmId);
		}
	}

	public void DeleteGenreFromMovie(Long filmId, Long genreId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Genre> deleteGenre = genreRepository.findById(genreId);
			if (deleteGenre.isPresent()) {
				film.get().getGenres().remove(deleteGenre.get());
				filmRepository.save(film.get());
			}
		}
	}

	public void DeleteDirectorFromMovie(Long filmId, Long directorId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Director> deleteDirector = directorRepository.findById(directorId);
			if (deleteDirector.isPresent()) {
				film.get().getDirectors().remove(deleteDirector.get());
				filmRepository.save(film.get());
			}
		}
	}

	public void DeleteActorFromMovie(Long filmId, Long actorId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Actor> deleteActor = actorRepository.findById(actorId);
			if (deleteActor.isPresent()) {
				film.get().getActors().remove(deleteActor.get());
				filmRepository.save(film.get());
			}
		}
	}

	public void DeleteScreenwriterFromMovie(Long filmId, Long screenwriterId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<ScreenWriter> deleteScreenwriter = screenWriterRepository.findById(screenwriterId);
			if (deleteScreenwriter.isPresent()) {
				film.get().getScreenWriters().remove(deleteScreenwriter.get());
				filmRepository.save(film.get());
			}
		}
	}

	public void DeleteOperatorFromMovie(Long filmId, Long operatorId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Operator> deleteOperator = operatorRepository.findById(operatorId);
			if (deleteOperator.isPresent()) {
				film.get().getOperators().remove(deleteOperator.get());
				filmRepository.save(film.get());
			}
		}
	}

	public void DeleteMusicianFromMovie(Long filmId, Long musicianId) {
		Optional<Film> film = filmRepository.findById(filmId);

		if (film.isPresent()) {
			Optional<Musician> deleteMusician = musicianRepository.findById(musicianId);
			if (deleteMusician.isPresent()) {
				film.get().getMusicians().remove(deleteMusician.get());
				filmRepository.save(film.get());
			}
		}
	}


	public Film updateFilm(Long filmId, FilmDTO filmDetails) {
		Optional<Film> optionalFilm = filmRepository.findById(filmId);

		Film existingFilm = optionalFilm.get();

		// Обновляем все поля
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

		// Сохраняем изменения
		return filmRepository.save(existingFilm);
	}



}

