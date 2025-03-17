package org.example.chatservice.DTO;

import com.gokin.authservice.Model.User;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    User sender;
    String message;
}
