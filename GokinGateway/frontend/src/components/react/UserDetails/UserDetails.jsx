import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Typography, Box, Avatar } from '@mui/material';
import { setCredentials } from '../../redux/Auth/Action';

const UserDetails = () => {
    const dispatch = useDispatch();

    const credentials = useSelector((state) => state.credentialReducer.credentials);

    // Стейты для изменения информации
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(credentials.username);
    const [newEmail, setNewEmail] = useState(credentials.email);
    const [newAvatar, setNewAvatar] = useState(credentials.avatar);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [avatarError, setAvatarError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setAvatarError('Please upload a valid image file');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setNewAvatar(reader.result);
                setAvatarError(''); // clear error when a valid file is selected
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!newUsername || !newEmail || !password) {
            setErrorMessage('All fields are required');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(newEmail)) {
            setEmailError('Invalid email format');
            return;
        } else {
            setEmailError('');
        }

        try {
            const response = await fetch('http://localhost:8082/authservice/api/auth/credentials', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: credentials.id, password, username: newUsername, email: newEmail, avatar: newAvatar? newAvatar: credentials.avatar }),
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.message.includes('username')) {
                    setUsernameError('Username already exists');
                }
                if (error.message.includes('email')) {
                    setEmailError('Email already exists');
                }
                if (error.message.includes('password')) {
                    setErrorPassword(error.message || 'Incorrect password');
                }
                return;
            }

            const text = await response.text();
            if (!text) {
                return;
            }

            const newCredentials = JSON.parse(text);
            dispatch(setCredentials(newCredentials));
            console.log(newCredentials);
            // Reset fields and errors
            setNewAvatar(newCredentials.avatar);
            setNewEmail(newCredentials.email);
            setPassword('');
            setNewUsername(newCredentials.email);
            setIsEditing(false);
            setErrorPassword('');
            setUsernameError('');
            setEmailError('');
            setAvatarError('');
            setErrorMessage('');
        } catch (error) {
            setErrorPassword('Error occurred while updating credentials');
            console.error('Error:', error);
        }
    };

    return (
        <div className='movie-content-wrapper'>
            <div className="main-page-wrapper" style={{ alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src={newAvatar} alt={credentials.username} sx={{ width: 100, height: 100, mb: 2, border: '2px solid black' }} />
                    {!isEditing ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {credentials.username}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Роль: {credentials.role}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Email: {credentials.email}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <label htmlFor="upload-image">
                                <input
                                    accept="image/*"
                                    id="upload-image"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <Button variant="contained" component="span" sx={{ marginBottom: 2 }}>
                                    Загрузить новый аватар
                                </Button>
                            </label>
                            {avatarError && <Typography color="error">{avatarError}</Typography>}

                            <TextField
                                label="Имя пользователя"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                sx={{ mb: 2, width: '100%' }}
                                error={!!usernameError}
                                helperText={usernameError}
                            />
                            <TextField
                                label="Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                sx={{ mb: 2, width: '100%' }}
                                error={!!emailError}
                                helperText={emailError}
                            />
                            <TextField
                                label="Введите пароль"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={handlePasswordChange}
                                sx={{ mb: 2 }}
                                error={!!errorPassword}
                                helperText={errorPassword}
                            />
                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                        </>
                    )}

                    {isEditing ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ width: '100%', mt: 2 }}
                        >
                            Изменить информацию
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsEditing(true)}
                            sx={{ width: '100%', mt: 2 }}
                        >
                            Изменить информацию
                        </Button>
                    )}
                </Box>
            </div>
        </div>
    );
};

export default UserDetails;
