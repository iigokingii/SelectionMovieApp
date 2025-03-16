package com.example.filmservice.Model;

import com.gokin.authservice.Model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "favorite_film")
public class FavoriteFilm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne
    @JoinColumn(name = "film_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Film film;

    @Column(name = "added_at", nullable = false)
    private Date addedAt;

}
