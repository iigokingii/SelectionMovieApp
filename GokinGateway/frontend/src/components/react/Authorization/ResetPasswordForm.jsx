import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";

const ResetPasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (token) {
            setToken(token);
        } else {
            setError("Токен сброса пароля или email отсутствуют.");
        }
    }, [location]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                window.location.href = "http://localhost:3000/sign-in";
            }, 3000);
        }
    }, [success, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Пароли не совпадают.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8082/authservice/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.text();
                throw new Error(data || "Ошибка при сбросе пароля.");
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message || "Произошла ошибка при сбросе пароля.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
    <form className="sign-up-form2" onSubmit={handleSubmit}>
        <Container maxWidth="sm" sx={{ width: "400px" }}>
            <Typography variant="h5" gutterBottom align="center">
                Сброс пароля
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Пароль успешно изменен! Перенаправление...</Alert>}

            {token ? (
                <>
                    <TextField
                        fullWidth
                        label="Новый пароль"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Подтверждение пароля"
                        variant="outlined"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Сменить пароль"}
                    </Button>
                </>
            ) : null}
        </Container>
    </form>
</div>

    );
};

export default ResetPasswordForm;
