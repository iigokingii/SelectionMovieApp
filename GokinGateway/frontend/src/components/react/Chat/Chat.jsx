import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import { TextField, Button, Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import _ from 'lodash';

const Chat = () => {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatRooms, setChatRooms] = useState([]);
    const [currentChatRoom, setCurrentChatRoom] = useState(null);
    const credentials = useSelector((state) => state.credentialReducer.credentials);
    const fetchChatRooms = () => {
        fetch("http://localhost:8082/chatservice/api/chat/admin/chats")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setChatRooms(data);
            })
            .catch((error) => {
                console.error("Произошла ошибка при загрузке данных:", error);
            });
        console.log(chatRooms);
    };

    useEffect(() => {
        fetchChatRooms();
    }, []);

    useEffect(() => {
        if (currentChatRoom) {
            const fetchMessages = async () => {
                try {
                    const response = await fetch(`http://localhost:8082/chatservice/api/chat/room/${currentChatRoom.id}/messages`);
                    if (!response.ok) throw new Error("Ошибка загрузки сообщений");
                    
                    const history = await response.json();
                    setMessages(history);
                } catch (error) {
                    console.error("Ошибка при загрузке сообщений:", error);
                }
            };
    
            fetchMessages();
    
            const stompClient = new Client({
                brokerURL: "ws://localhost:8082/chatservice/api/chat/websocket",
                connectHeaders: {},
                onConnect: () => {
                    console.log("Connected to WebSocket");
                    stompClient.subscribe(`/topic/messages/${currentChatRoom.id}`, (msg) => {
                        const receivedMessage = JSON.parse(msg.body);
                        setMessages((prev) => [...prev, receivedMessage]);
                    });
                },
                onStompError: (frame) => {
                    console.error("WebSocket error", frame);
                },
            });
    
            stompClient.activate();
            setClient(stompClient);
    
            return () => {
                if (stompClient) stompClient.deactivate();
            };
        }
    }, [currentChatRoom]);
    

    console.log(messages);

    const sendMessage = () => {
        if (client && message.trim() !== "") {
            const chatMessage = { userId: credentials.id, content: message, chatRoomId: currentChatRoom.id };
            client.publish({
                destination: `/app/send/${currentChatRoom.id}`,
                body: JSON.stringify(chatMessage),
                headers: {
                    "content-type": "application/json",
                },
            });
            setMessage("");
        }
    };

    // Функция для создания новой комнаты
    const createChatRoom = () => {
        fetch("http://localhost:8082/chatservice/api/chat/room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: credentials.id, username: credentials.username }),
        })
            .then((response) => response.json())
            .then((newRoom) => {
                setChatRooms((prev) => [...prev, newRoom]);
                setCurrentChatRoom(newRoom);
            })
            .catch((error) => console.error("Ошибка при создании чата:", error));
    };

    return (
        <Box
            sx={{
                width: "500px",
                margin: "auto",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                borderRadius: "8px",
                boxShadow: 2,
            }}
        >
            <Typography variant="h5" gutterBottom>
                Чат с администратором
            </Typography>

            {/* Username input */}
            <TextField
                label="Ваше имя"
                variant="outlined"
                fullWidth
                value={credentials.username}
                disabled={true}
                sx={{ marginBottom: "20px" }}
            />

            {/* Кнопка создания новой комнаты */}
            <Button
                onClick={createChatRoom}
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#4caf50",
                    '&:hover': {
                        backgroundColor: "#388e3c",
                    },
                    marginBottom: "10px",
                }}
            >
                Создать новую комнату
            </Button>

            {/* Список доступных комнат чатов */}
            <Box
                sx={{
                    marginBottom: "20px",
                    padding: "10px",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    height: "200px",
                    overflowY: "scroll",
                }}
            >
                <Typography variant="h6" gutterBottom>Доступные комнаты</Typography>
                <List>
                    {!_.isEmpty(chatRooms) && chatRooms.map((room) => (
                        <ListItem
                            button
                            key={room.id}
                            onClick={() => setCurrentChatRoom(room)}
                        >
                            <ListItemText primary={room.roomName} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Messages display */}
            <Box
                sx={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    height: "300px",
                    overflowY: "scroll",
                    marginBottom: "20px",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                }}
            >
                {messages.map((msg, index) => {
                    
                    console.log(msg);
                    return (
                    <Typography key={index}>
                        <strong>{msg.user?.username || msg.sender.username}:</strong> {msg.message}
                    </Typography>
                )})}
            </Box>

            {/* Message input */}
            <TextField
                label="Введите сообщение..."
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                sx={{ marginBottom: "20px" }}
            />

            <Button
                onClick={sendMessage}
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#fbc02d",
                    '&:hover': {
                        backgroundColor: "#f9a825",
                    },
                    padding: "10px",
                }}
                disabled={!currentChatRoom} // Отключаем кнопку, если комната не выбрана
            >
                Отправить
            </Button>
        </Box>
    );
};

export default Chat;





// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Client } from "@stomp/stompjs";
// import { TextField, Button, Box, Typography } from "@mui/material";

// const Chat = () => {
//     const [client, setClient] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [username, setUsername] = useState("");
//     const credentials = useSelector((state) => state.credentialReducer.credentials)
//     console.log(credentials);

//     useEffect(() => {
//         const stompClient = new Client({
//             brokerURL: "ws://localhost:8082/chatservice/api/chat/websocket",
//             connectHeaders: {},
//             onConnect: () => {
//                 console.log("Connected to WebSocket");

//                 stompClient.subscribe("/topic/messages", (msg) => {
//                     const receivedMessage = JSON.parse(msg.body);
//                     setMessages((prev) => [...prev, receivedMessage]);
//                 });
//             },
//             onStompError: (frame) => {
//                 console.error("WebSocket error", frame);
//             },
//         });

//         stompClient.activate();
//         setClient(stompClient);

//         return () => {
//             if (stompClient) stompClient.deactivate();
//         };
//     }, []);

//     const sendMessage = () => {
//         if (client && message.trim() !== "") {
//             const chatMessage = { sender: username || "Гость", content: message };
//             console.log(chatMessage);
//             client.publish({
//                 destination: "/app/send",
//                 body: JSON.stringify(chatMessage),
//                 headers: {
//                     "content-type": "application/json",
//                 },
//             });
//             setMessage("");
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 width: "400px",
//                 margin: "auto",
//                 padding: "20px",
//                 textAlign: "center",
//                 backgroundColor: "#f4f4f4",
//                 borderRadius: "8px",
//                 boxShadow: 2,
//             }}
//         >
//             <Typography variant="h5" gutterBottom>
//                 Чат с администратором
//             </Typography>

//             {/* Username input */}
//             <TextField
//                 label="Ваше имя"
//                 variant="outlined"
//                 fullWidth
//                 value={credentials.username}
//                 disabled={true}
//                 sx={{ marginBottom: "20px" }}
//             />

//             {/* Messages display */}
//             <Box
//                 sx={{
//                     border: "1px solid #ccc",
//                     padding: "10px",
//                     height: "300px",
//                     overflowY: "scroll",
//                     marginBottom: "20px",
//                     borderRadius: "4px",
//                     backgroundColor: "#fff",
//                 }}
//             >
//                 {messages.map((msg, index) => (
//                     <Typography key={index}>
//                         <strong>{msg.sender}:</strong> {msg.content}
//                     </Typography>
//                 ))}
//             </Box>

//             <TextField
//                 label="Введите сообщение..."
//                 variant="outlined"
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                 sx={{ marginBottom: "20px" }}
//             />

//             <Button
//                 onClick={sendMessage}
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                     backgroundColor: "#fbc02d",
//                     '&:hover': {
//                         backgroundColor: "#f9a825",
//                     },
//                     padding: "10px",
//                 }}
//             >
//                 Отправить
//             </Button>
//         </Box>
//     );
// };

// export default Chat;
