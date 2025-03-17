package org.example.chatservice.Service;

import com.gokin.authservice.Model.User;
import com.gokin.authservice.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.example.chatservice.DTO.ChatMessage;
import org.example.chatservice.DTO.ChatMessageResponse;
import org.example.chatservice.Model.Chat;
import org.example.chatservice.Model.ChatRoom;

import org.example.chatservice.Repository.ChatRepository;
import org.example.chatservice.Repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate; // Для отправки сообщений в WebSocket

    @Autowired
    public ChatService(ChatRepository chatRepository, ChatRoomRepository chatRoomRepository,
                       UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.chatRepository = chatRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<ChatRoom> getAllChats() {
        return chatRoomRepository.findAll();
    }

    public List<Chat> getMessagesInChatRoom(Long chatRoomId) {
        return chatRepository.findByChatRoomId(chatRoomId);
    }

    public ChatMessageResponse sendMessage(ChatMessage message, Long chatRoomId) {
        var user = userRepository.findById(message.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + message.getUserId()));
        var chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found with ID: " + chatRoomId));

        Chat chatMessage = Chat.builder()
                .message(message.getContent())
                .user(user)
                .chatRoom(chatRoom)
                .viewed(false)
                .sentAt(LocalDateTime.now())
                .build();

        chatRepository.save(chatMessage);

        return ChatMessageResponse.builder()
                .sender(user)
                .message(message.getContent())
                .build();
    }

    public void broadcastMessage(Long chatRoomId, ChatMessageResponse message) {
        messagingTemplate.convertAndSend("/topic/messages/" + chatRoomId, message);
    }

    public ChatRoom createChatRoom(User user) {
        ChatRoom chatRoom = ChatRoom.builder()
                .user(user)
                .isOpen(true)
                .roomName("Чат с " + user.getUsername())
                .build();

        return chatRoomRepository.save(chatRoom);
    }

    public void closeChatRoom(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found with ID: " + chatRoomId));
        chatRoom.setOpen(false);
        chatRoomRepository.save(chatRoom);
    }
}



