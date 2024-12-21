import React, { useState } from "react";
import '../../../../static/Movie/MovieComment.css';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, TextField, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { deleteComment, updateComment } from "../../../redux/Movies/action";

const MovieComment = ({ comment, movieId }) => {
    const credentials = useSelector((state) => state.credentialReducer.credentials);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(comment.message);

    const handleDelete = async (commentId) => {
        const response = await fetch(`http://localhost:8082/filmservice/api/films/${movieId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            dispatch(deleteComment(movieId, commentId));
            console.log("Удаление выполнено! ", { commentId, movieId });
        }
    };

    const handleEdit = async (commentId) => {
        const response = await fetch(`http://localhost:8082/filmservice/api/films/${movieId}/comments/${commentId}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ comment: editedMessage, userId: credentials.id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log("Изменение выполнено! ", { commentId, movieId, editedMessage });
            const comment = await response.json();
            dispatch(updateComment(movieId, commentId, comment))
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedMessage(comment.message);
        setIsEditing(false);
    };

    return (
        <div className="movie-comment-card-wrapper">
            <div className="movie-comment-header">
                {!_.isNull(comment.user)
                    ? <div className="movie-comment-user-info-wrapper">
                        {!_.isUndefined(comment.user)
                            ? (<div className="comment-avatar">
                                <img
                                    src={comment.user.avatar}
                                    alt="Аватар"
                                />
                            </div>)
                            : null}
                        {comment.user.role.split("_")[1].toLowerCase() === 'admin'
                            ? <div style={{ color: "red", paddingBottom: "5px", paddingRight: "10px", fontWeight: "bold", fontSize: "12px", }}>
                                ADMIN
                            </div>
                            : null}
                        <div className="comment-username">
                            {comment.user.username}
                        </div>
                        {credentials.role === "admin" ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingBottom: "6px" }}>
                                {!isEditing
                                    ? <IconButton color="primary" onClick={() => setIsEditing(true)} sx={{ width: 20, height: 20 }}>
                                        <EditIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                    : null}
                                <IconButton color="error" onClick={() => handleDelete(comment.id)} sx={{ width: 20, height: 20 }}>
                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </div>
                        ) : null}
                    </div>
                    : null}
            </div>
            <div className="movie-comment-message">
                {!isEditing
                    ? comment.message.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))
                    : <div>
                        <TextField
                            value={editedMessage}
                            onChange={(e) => setEditedMessage(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{
                                width: '100%',
                                marginTop: 1,
                                marginBottom: 1,
                                fontSize: 14,
                                backgroundColor: '#f9f9f9'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEdit(comment.id)}
                                sx={{ fontSize: 12 }}
                            >
                                Изменить
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelEdit}
                                sx={{ fontSize: 12 }}
                            >
                                Отменить
                            </Button>
                        </div>
                    </div>}
            </div>
            <div className="movie-comment-date">
                {comment.dateOfPosting}
            </div>
        </div>
    );
};

export default MovieComment;
