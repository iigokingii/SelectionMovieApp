package org.example.chatservice.Controllers;

import com.gokin.authservice.Model.User;
import org.example.chatservice.DTO.ChatMessage;
import org.example.chatservice.DTO.ChatMessageResponse;
import org.example.chatservice.Model.Chat;
import org.example.chatservice.Model.ChatRoom;
import org.example.chatservice.Service.ChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/admin/chats")
    public List<ChatRoom> getAllChats() {
        return chatService.getAllChats();
    }

    @GetMapping("/room/{chatRoomId}/messages")
    public List<Chat> getMessagesInChatRoom(@PathVariable Long chatRoomId) {
        return chatService.getMessagesInChatRoom(chatRoomId);
    }

    @MessageMapping("/send/{chatRoomId}")
    public void sendMessage(@DestinationVariable Long chatRoomId, ChatMessage message) {
        ChatMessageResponse response = chatService.sendMessage(message, chatRoomId);
        chatService.broadcastMessage(chatRoomId, response);
    }

    @PostMapping("/room")
    public ChatRoom createChatRoom(@RequestBody User user) {
        return chatService.createChatRoom(user);
    }

    @PostMapping("/room/{chatRoomId}/close")
    public void closeChatRoom(@PathVariable Long chatRoomId) {
        chatService.closeChatRoom(chatRoomId);
    }
}


