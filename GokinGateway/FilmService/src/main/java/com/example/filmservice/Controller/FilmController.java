package com.example.filmservice.Controller;

import com.example.filmservice.DTO.CommentDTO;
import com.example.filmservice.DTO.FilmDTO;
import com.example.filmservice.DTO.GenreDTO;
import com.example.filmservice.DTO.PersonDTO;
import com.example.filmservice.Model.*;
import com.example.filmservice.Service.FilmService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/films")
public class FilmController {
	@Autowired
	FilmService filmService;

	@GetMapping("")
	public List<Film> GetFilms(){
		return filmService.GetFilms();
	}

	@GetMapping("/{filmId}")
	public Film GetFilm(@PathVariable Long filmId) {
		return filmService.GetFilm(filmId);
	}

	@PostMapping("/film")
	public Film AddFilm(@RequestBody FilmDTO film){
		return filmService.AddFilm(film);
	}

	@PostMapping("/film/{filmId}/comment")
	public Comment AddComment(@PathVariable Long filmId, @RequestBody CommentDTO comment){
		return filmService.AddComment(filmId, comment);
	}

	@PostMapping("/{filmId}/genres")
	public Genre AddGenre(@PathVariable Long filmId, @RequestBody GenreDTO genre){
		return filmService.AddGenre(filmId, genre);
	}

	@PostMapping("/{filmId}/directors")
	public Director AddDirector(@PathVariable Long filmId, @RequestBody PersonDTO director){
		return filmService.AddDirector(filmId, director);
	}

	@PostMapping("/{filmId}/actors")
	public Actor AddActor(@PathVariable Long filmId, @RequestBody PersonDTO actor){
		return filmService.AddActor(filmId, actor);
	}

	@PostMapping("/{filmId}/screenwriters")
	public ScreenWriter AddScreenwriter(@PathVariable Long filmId, @RequestBody PersonDTO screenwriter){
		return filmService.AddScreenwriter(filmId, screenwriter);
	}

	@PostMapping("/{filmId}/operators")
	public Operator AddOperator(@PathVariable Long filmId, @RequestBody PersonDTO operator){
		return filmService.AddOperator(filmId, operator);
	}

	@PostMapping("/film/{filmId}")
	public Film updateFilm(
			@PathVariable Long filmId,
			@RequestBody FilmDTO filmDetails) {
		Film updatedFilm = filmService.updateFilm(filmId, filmDetails);
		return updatedFilm;
	}

	@PostMapping("/{filmId}/musicians")
	public Musician AddMusician(@PathVariable Long filmId, @RequestBody PersonDTO musician){
		return filmService.AddMusician(filmId, musician);
	}

	@DeleteMapping("/{filmId}")
	public void DeleteFilm(@PathVariable Long filmId) {
		filmService.DeleteFilm(filmId);
	}

	@DeleteMapping("/{filmId}/genres/{genreId}")
	public void DeleteGenreFromMovie(@PathVariable Long filmId, @PathVariable Long genreId) {
		filmService.DeleteGenreFromMovie(filmId, genreId);
	}

	@DeleteMapping("/{filmId}/directors/{directorId}")
	public void DeleteDirectorFromMovie(@PathVariable Long filmId, @PathVariable Long directorId) {
		filmService.DeleteDirectorFromMovie(filmId, directorId);
	}

	@DeleteMapping("/{filmId}/actors/{actorId}")
	public void DeleteActorFromMovie(@PathVariable Long filmId, @PathVariable Long actorId) {
		filmService.DeleteActorFromMovie(filmId, actorId);
	}

	@DeleteMapping("/{filmId}/screenwriters/{screenwriterId}")
	public void DeleteScreenwriterFromMovie(@PathVariable Long filmId, @PathVariable Long screenwriterId) {
		filmService.DeleteScreenwriterFromMovie(filmId, screenwriterId);
	}

	@DeleteMapping("/{filmId}/operators/{operatorId}")
	public void DeleteOperatorFromMovie(@PathVariable Long filmId, @PathVariable Long operatorId) {
		filmService.DeleteOperatorFromMovie(filmId, operatorId);
	}

	@DeleteMapping("/{filmId}/musicians/{musicianId}")
	public void DeleteMusicianFromMovie(@PathVariable Long filmId, @PathVariable Long musicianId) {
		filmService.DeleteMusicianFromMovie(filmId, musicianId);
	}

	@DeleteMapping("/{filmId}/comments/{commentId}")
	public void DeleteComment(@PathVariable Long filmId, @PathVariable Long commentId) {
		filmService.DeleteComment(filmId, commentId);
	}
}
