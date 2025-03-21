import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import '../../../static/AiChat/AiChat.css';
import { useSelector } from 'react-redux';

const AiChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const credentials = useSelector(state => state.credentialReducer.credentials);
    function formatResponse(response) {
        const withoutStars = response.replace(/\*\*/g, '');
        const points = withoutStars.split(/(?=\d+\.\s)/);
        const formattedPoints = points.map(point => point.trim()).filter(Boolean).join('<br /><br />');
        return formattedPoints;
    }

    const handleSendMessage = async () => {
        if (input.trim() && !isLoading) {
            const userMessage = { text: input, sender: 'user', time: new Date().toLocaleTimeString() };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInput('');
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8082/aiservice/api/ai-chat?email=${credentials.email}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: input }),
                });

                // if (!response.ok) {
                //     throw new Error('Network response was not ok');
                // }
                const data = await response.json();
                var botMessageText = '';
                if(data.status === 403){
                    botMessageText = data.message;
                }
                else{
                    botMessageText = data.response;
                }
                if (botMessageText) {
                    const botMessage = {
                        text: formatResponse(botMessageText),
                        sender: 'bot',
                        time: new Date().toLocaleTimeString(),
                    };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);
                } else {
                    console.error('Empty response from server');
                    const errorMessage = {
                        text: 'Сервер не вернул ответ.',
                        sender: 'bot',
                        time: new Date().toLocaleTimeString(),
                    };
                    setMessages((prevMessages) => [...prevMessages, errorMessage]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                const errorMessage = {
                    text: 'Произошла ошибка при получении ответа от сервера.',
                    sender: 'bot',
                    time: new Date().toLocaleTimeString(),
                };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetch('http://localhost:8082/aiservice/api/ai-chat/new-dialog', { method: 'POST', credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }, });
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <React.Fragment>
            <Box className="chat-wrapper">
                <Box className="chat-container">
                    {messages.length === 0 ? (
                        <Box className="empty-state">
                            <Typography variant="body2" className="placeholder-text">
                                Вводите всё что вас интересует, а мы постараемся вам ответить
                            </Typography>
                            <Box className="input-container-empty">
                                <TextField
                                    variant="outlined"
                                    placeholder="Введите сообщение..."
                                    fullWidth
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSendMessage();
                                    }}
                                    className="text-field"
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                    className="send-button"
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <List className="message-list">
                                {messages.map((message, index) => (
                                    <ListItem key={index} className={`message-item ${message.sender}`}>
                                        <Paper elevation={3} className={`message-bubble ${message.sender}`}>
                                            <ListItemText
                                                primary={
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        {message.sender === 'bot' ? (
                                                            <div
                                                                className="message-text"
                                                                dangerouslySetInnerHTML={{ __html: message.text }}
                                                            />
                                                        ) : (
                                                            <Typography variant="body1" className="message-text">
                                                                {message.text}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="caption" style={{ alignSelf: 'flex-end', marginTop: '4px' }}>
                                                            {message.time}
                                                        </Typography>
                                                    </div>
                                                }
                                            />
                                        </Paper>
                                    </ListItem>
                                ))}
                            </List>

                            <Box ref={messagesEndRef} />

                            <Box className="input-container">
                                <TextField
                                    variant="outlined"
                                    placeholder="Введите сообщение..."
                                    fullWidth
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSendMessage();
                                    }}
                                    className="text-field"
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                    className="send-button"
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default AiChat;
