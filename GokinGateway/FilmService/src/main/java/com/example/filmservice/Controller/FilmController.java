package com.example.filmservice.Controller;

import com.example.filmservice.DTO.*;
import com.example.filmservice.Model.*;
import com.example.filmservice.Repository.FilmRepository;
import com.example.filmservice.Service.FilmService;
import com.example.filmservice.Service.S3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/films")
public class FilmController {

	@Autowired
	private FilmService filmService;
    @Autowired
    FilmRepository filmRepository;
	@Autowired
	S3Service s3Service;


	@Operation(summary = "Получить параметры фильма для пользователя")
	@GetMapping("/options/{userId}")
	public MovieOptionsDTO GetOptions(@Parameter(description = "ID пользователя") @PathVariable Long userId) {
		return filmService.GetOptions(userId);
	}

	@Operation(summary = "Получить список всех фильмов")
	@GetMapping("")
	public List<Film> GetFilms() {
		return filmService.GetFilms();
	}

	@Operation(summary = "Получить информацию о фильме по ID")
	@GetMapping("/{filmId}")
	public Film GetFilm(@Parameter(description = "ID фильма") @PathVariable Long filmId) {
		return filmService.GetFilm(filmId);
	}

	@Operation(summary = "Добавить новый фильм")
	@PostMapping(value = "/film", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<Film> addFilm(
			@RequestPart("film") FilmDTO filmDTO,
			@RequestPart(value = "poster", required = false) MultipartFile poster) {
		try {
			if (poster != null) {
				String posterUrl = s3Service.uploadFile(poster);
				filmDTO.setPoster(posterUrl);
			}
			Film savedFilm = filmService.AddFilm(filmDTO);
			return ResponseEntity.ok(savedFilm);
		} catch (IOException e) {
			return ResponseEntity.internalServerError().body(null);
		}
	}

    @Operation(summary = "Обновить информацию о фильме")
    @PutMapping("/film/{filmId}")
    public ResponseEntity<Film> updateFilm(
            @Parameter(description = "ID фильма") @PathVariable Long filmId,
            @RequestPart @Valid FilmDTO filmDetails,
            @RequestPart(value = "poster", required = false) MultipartFile poster) {
        try {
            Optional<Film> existingFilm = filmRepository.findById(filmId);

            if (poster != null && existingFilm.isPresent()) {
                var existfilm = existingFilm.get();
                //s3Service.DeleteFile(existfilm.getPoster());
                String newPosterUrl = s3Service.uploadFile(poster);
                filmDetails.setPoster(newPosterUrl);
            }

            Film updatedFilm = filmService.updateFilm(filmId, filmDetails);
            return ResponseEntity.ok(updatedFilm);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
	@Operation(summary = "Обновить gokin рейтинг фильма")
	@PostMapping("/film/{filmId}/rating/{userId}")
	public ResponseEntity<?> updateGokinRating(
			@Parameter(description = "ID фильма")
			@PathVariable Long filmId,
			@PathVariable Long userId,
			@RequestBody @Valid int gokinRating) {
		return filmService.AddRating(filmId, userId, gokinRating);
	}

	@Operation(summary = "Удалить фильм по ID")
	@DeleteMapping("/{filmId}")
	public void DeleteFilm(@Parameter(description = "ID фильма") @PathVariable Long filmId) {
		var deleted = filmService.DeleteFilm(filmId);
        if(deleted.isPresent())
            s3Service.DeleteFile(deleted.get().getPoster());
	}

	@Operation(summary = "Добавить комментарий к фильму")
	@PostMapping("/film/{filmId}/comment")
	public Comment AddComment(@PathVariable Long filmId, @RequestBody @Valid CommentDTO comment) {
		return filmService.AddComment(filmId, comment);
	}

	@Operation(summary = "Удалить комментарий к фильму")
	@DeleteMapping("/{filmId}/comments/{commentId}")
	public void DeleteComment(@PathVariable Long filmId, @PathVariable Long commentId) {
		filmService.DeleteComment(filmId, commentId);
	}

	@Operation(summary = "Обновить комментарий к фильму")
	@PostMapping("/{filmId}/comments/{commentId}")
	public Comment UpdateComment(@PathVariable Long filmId, @PathVariable Long commentId, @RequestBody @Valid CommentDTO comment) {
		return filmService.UpdateComment(filmId, commentId, comment);
	}

	@Operation(summary = "Добавить жанр к фильму")
	@PostMapping("/{filmId}/genres")
	public Genre AddGenre(@PathVariable Long filmId, @RequestBody @Valid GenreDTO genre) {
		return filmService.AddGenre(filmId, genre);
	}

	@Operation(summary = "Удалить жанр из фильма")
	@DeleteMapping("/{filmId}/genres/{genreId}")
	public Genre DeleteGenreFromMovie(@PathVariable Long filmId, @PathVariable Long genreId) {
		return filmService.DeleteGenreFromMovie(filmId, genreId);
	}

	@Operation(summary = "Добавить режиссера к фильму")
	@PostMapping("/{filmId}/directors")
	public Director AddDirector(@PathVariable Long filmId, @RequestBody @Valid PersonDTO director) {
		return filmService.AddDirector(filmId, director);
	}

	@Operation(summary = "Удалить режиссера из фильма")
	@DeleteMapping("/{filmId}/directors/{directorId}")
	public Director DeleteDirectorFromMovie(@PathVariable Long filmId, @PathVariable Long directorId) {
		return filmService.DeleteDirectorFromMovie(filmId, directorId);
	}

	@Operation(summary = "Добавить актера к фильму")
	@PostMapping("/{filmId}/actors")
	public Actor AddActor(@PathVariable Long filmId, @RequestBody @Valid PersonDTO actor) {
		return filmService.AddActor(filmId, actor);
	}

	@Operation(summary = "Удалить актера из фильма")
	@DeleteMapping("/{filmId}/actors/{actorId}")
	public Actor DeleteActorFromMovie(@PathVariable Long filmId, @PathVariable Long actorId) {
		return filmService.DeleteActorFromMovie(filmId, actorId);
	}

	@Operation(summary = "Добавить сценариста к фильму")
	@PostMapping("/{filmId}/screenwriters")
	public ScreenWriter AddScreenwriter(@PathVariable Long filmId, @RequestBody @Valid PersonDTO screenwriter) {
		return filmService.AddScreenwriter(filmId, screenwriter);
	}

	@Operation(summary = "Удалить сценариста из фильма")
	@DeleteMapping("/{filmId}/screenwriters/{screenwriterId}")
	public ScreenWriter DeleteScreenwriterFromMovie(@PathVariable Long filmId, @PathVariable Long screenwriterId) {
		return filmService.DeleteScreenwriterFromMovie(filmId, screenwriterId);
	}

	@Operation(summary = "Добавить оператора к фильму")
	@PostMapping("/{filmId}/operators")
	public Operator AddOperator(@PathVariable Long filmId, @RequestBody @Valid PersonDTO operator) {
		return filmService.AddOperator(filmId, operator);
	}

	@Operation(summary = "Удалить оператора из фильма")
	@DeleteMapping("/{filmId}/operators/{operatorId}")
	public Operator DeleteOperatorFromMovie(@PathVariable Long filmId, @PathVariable Long operatorId) {
		return filmService.DeleteOperatorFromMovie(filmId, operatorId);
	}

	@Operation(summary = "Добавить музыканта к фильму")
	@PostMapping("/{filmId}/musicians")
	public Musician AddMusician(@PathVariable Long filmId, @RequestBody @Valid PersonDTO musician) {
		return filmService.AddMusician(filmId, musician);
	}

	@Operation(summary = "Удалить музыканта из фильма")
	@DeleteMapping("/{filmId}/musicians/{musicianId}")
	public Musician DeleteMusicianFromMovie(@PathVariable Long filmId, @PathVariable Long musicianId) {
		return filmService.DeleteMusicianFromMovie(filmId, musicianId);
	}

	@Operation(summary = "Добавить продюсера к фильму")
	@PostMapping("/{filmId}/producers")
	public Producer AddProducer(@PathVariable Long filmId, @RequestBody @Valid PersonDTO producer) {
		return filmService.AddProducer(filmId, producer);
	}

	@Operation(summary = "Удалить продюсера из фильма")
	@DeleteMapping("/{filmId}/producers/{producerId}")
	public Producer DeleteProducerFromMovie(@PathVariable Long filmId, @PathVariable Long producerId) {
		return filmService.DeleteProducerFromMovie(filmId, producerId);
	}

	@Operation(summary = "Получить избранные фильмы пользователя")
	@GetMapping("/favorites/{userId}")
	public List<FavoriteFilm> GetFavoritesOfUser(@Parameter(description = "ID пользователя") @PathVariable Long userId) {
		return filmService.GetFavoritesOfUser(userId);
	}

	@Operation(summary = "Добавить фильм в избранное")
	@PostMapping("/favorites")
	public FavoriteFilm AddFavorite(@RequestBody @Valid FavoriteFilmDTO favorite) {
		return filmService.AddFavorite(favorite);
	}

	@Operation(summary = "Удалить фильм из избранного")
	@DeleteMapping("/favorites/{favoriteId}")
	public Long RemoveFavorite(@Parameter(description = "ID записи избранного фильма") @PathVariable Long favoriteId) {
		return filmService.RemoveFavorite(favoriteId);
	}
}
