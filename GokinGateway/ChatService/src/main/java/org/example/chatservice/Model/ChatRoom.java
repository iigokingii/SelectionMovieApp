package org.example.chatservice.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gokin.authservice.Model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat_room")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_room_id_seq")
    @SequenceGenerator(name = "chat_room_id_seq", sequenceName = "chat_room_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Chat> messages;

    @Column(name = "is_open", nullable = false)
    private boolean isOpen;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;
}
