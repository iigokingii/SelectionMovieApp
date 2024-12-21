package com.example.filmservice.Controller;

import com.example.filmservice.DTO.*;
import com.example.filmservice.Model.*;
import com.example.filmservice.Service.FilmService;
import jakarta.validation.Valid;
import org.apache.commons.lang.NotImplementedException;
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

	@GetMapping("/options")
	public MovieOptionsDTO GetOptions() {
		return filmService.GetOptions();
	}

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

	@PostMapping("/film/{filmId}")
	public Film updateFilm(
			@PathVariable Long filmId,
			@RequestBody FilmDTO filmDetails) {
		Film updatedFilm = filmService.updateFilm(filmId, filmDetails);
		return updatedFilm;
	}

	@DeleteMapping("/{filmId}")
	public void DeleteFilm(@PathVariable Long filmId) {
		filmService.DeleteFilm(filmId);
	}

	@PostMapping("/film/{filmId}/comment")
	public Comment AddComment(@PathVariable Long filmId, @RequestBody CommentDTO comment){
		return filmService.AddComment(filmId, comment);
	}

	@DeleteMapping("/{filmId}/comments/{commentId}")
	public void DeleteComment(@PathVariable Long filmId, @PathVariable Long commentId) {
		filmService.DeleteComment(filmId, commentId);
	}

	@PostMapping("/{filmId}/comments/{commentId}")
	public Comment UpdateComment(@PathVariable Long filmId, @PathVariable Long commentId, @RequestBody CommentDTO comment) {
		return filmService.UpdateComment(filmId, commentId, comment);
	}

	@PostMapping("/{filmId}/genres")
	public Genre AddGenre(@PathVariable Long filmId, @RequestBody GenreDTO genre){
		return filmService.AddGenre(filmId, genre);
	}

	@DeleteMapping("/{filmId}/genres/{genreId}")
	public Genre DeleteGenreFromMovie(@PathVariable Long filmId, @PathVariable Long genreId) {
		return filmService.DeleteGenreFromMovie(filmId, genreId);
	}

	@PostMapping("/{filmId}/directors")
	public Director AddDirector(@PathVariable Long filmId, @RequestBody PersonDTO director){
		return filmService.AddDirector(filmId, director);
	}

	@DeleteMapping("/{filmId}/directors/{directorId}")
	public Director DeleteDirectorFromMovie(@PathVariable Long filmId, @PathVariable Long directorId) {
		return filmService.DeleteDirectorFromMovie(filmId, directorId);
	}

	@PostMapping("/{filmId}/actors")
	public Actor AddActor(@PathVariable Long filmId, @RequestBody PersonDTO actor){
		return filmService.AddActor(filmId, actor);
	}

	@DeleteMapping("/{filmId}/actors/{actorId}")
	public Actor DeleteActorFromMovie(@PathVariable Long filmId, @PathVariable Long actorId) {
		return filmService.DeleteActorFromMovie(filmId, actorId);
	}

	@PostMapping("/{filmId}/screenwriters")
	public ScreenWriter AddScreenwriter(@PathVariable Long filmId, @RequestBody PersonDTO screenwriter){
		return filmService.AddScreenwriter(filmId, screenwriter);
	}

	@DeleteMapping("/{filmId}/screenwriters/{screenwriterId}")
	public ScreenWriter DeleteScreenwriterFromMovie(@PathVariable Long filmId, @PathVariable Long screenwriterId) {
		return filmService.DeleteScreenwriterFromMovie(filmId, screenwriterId);
	}

	@PostMapping("/{filmId}/operators")
	public Operator AddOperator(@PathVariable Long filmId, @RequestBody PersonDTO operator){
			return filmService.AddOperator(filmId, operator);
	}

	@DeleteMapping("/{filmId}/operators/{operatorId}")
	public Operator DeleteOperatorFromMovie(@PathVariable Long filmId, @PathVariable Long operatorId) {
		return filmService.DeleteOperatorFromMovie(filmId, operatorId);
	}

	@PostMapping("/{filmId}/musicians")
	public Musician AddMusician(@PathVariable Long filmId, @RequestBody PersonDTO musician){
		return filmService.AddMusician(filmId, musician);
	}

	@DeleteMapping("/{filmId}/musicians/{musicianId}")
	public Musician DeleteMusicianFromMovie(@PathVariable Long filmId, @PathVariable Long musicianId) {
		return filmService.DeleteMusicianFromMovie(filmId, musicianId);
	}

	@PostMapping("/{filmId}/producers")
	public Producer AddProducer(@PathVariable Long filmId, @RequestBody PersonDTO producer){
		return filmService.AddProducer(filmId, producer);
	}

	@DeleteMapping("/{filmId}/producers/{producerId}")
	public Producer DeleteProducerFromMovie(@PathVariable Long filmId, @PathVariable Long producerId) {
		return filmService.DeleteProducerFromMovie(filmId, producerId);
	}

	@GetMapping("/favorites/{userId}")
	public List<FavoriteFilm> GetFavoritesOfUser(@PathVariable Long userId){
		return filmService.GetFavoritesOfUser(userId);
	}

	@PostMapping("/favorites")
	public FavoriteFilm AddFavorite(@RequestBody FavoriteFilmDTO favorite){
		return filmService.AddFavorite(favorite);
	}

	@DeleteMapping("/favorites/{favoriteId}")
}

