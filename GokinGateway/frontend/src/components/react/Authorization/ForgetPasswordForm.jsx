import React, { useState, useEffect } from "react";
import { Button, TextField, Snackbar, Alert } from "@mui/material";

const ForgetPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (isDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsDisabled(false);
        }
        return () => clearInterval(interval);
    }, [isDisabled, timer]);

    const handleResetPassword = async () => {
        setErrorMessage("");

        try {
            const response = await fetch(`http://localhost:8082/authservice/api/auth/forgot-password?email=${email}`, {
                method: "POST",
            });

            const text = await response.text();

            if (response.ok) {
                setResetMessage(text);
                setOpenSnackbar(true);
                setIsDisabled(true);
                setTimer(5 * 60);
            } else {
                setErrorMessage(text || "Произошла ошибка. Попробуйте снова.");
            }
        } catch (error) {
            console.error("Ошибка при запросе сброса пароля:", error);
            setErrorMessage("Ошибка соединения с сервером.");
        }
    };

    return (
        <div className="form-wrapper">
            <form className="sign-up-form2">
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <TextField
                        label="Введите ваш email для сброса"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: "10px" }}
                    />
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleResetPassword}
                        fullWidth
                        disabled={isDisabled}
                    >
                        {isDisabled ? `Повторите через ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}` : "Сбросить пароль"}
                    </Button>

                    {errorMessage && (
                        <Alert severity="error" style={{ marginTop: "10px" }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={() => setOpenSnackbar(false)}
                        message={resetMessage}
                    />
                </div>
            </form>
        </div>
    );
};

export default ForgetPasswordForm;
