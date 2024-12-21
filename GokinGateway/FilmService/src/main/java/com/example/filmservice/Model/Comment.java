package com.example.filmservice.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gokin.authservice.Model.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_id_seq")
    @SequenceGenerator(name = "comment_id_seq", sequenceName = "comment_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "message", nullable = false, length = 2000)
    private String message;

    @Column(name = "date_of_posting", nullable = false)
    private LocalDate dateOfPosting;

    // Связь с Film
    @ManyToOne
    @JoinColumn(name = "film_id", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonBackReference
    private Film film;

    // Связь с User
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonManagedReference
    private User user;


}
