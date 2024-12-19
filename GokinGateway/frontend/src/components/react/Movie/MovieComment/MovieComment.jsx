import React from "react";
import '../../../../static/Movie/MovieComment.css';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MovieComment = ({ comment }) => {
    const credentials = useSelector((state) => state.credentialReducer.credentials);
    console.log(comment);
    const handleDelete = (commentId) => {
        console.log("Удаление выполнено! ", commentId);
    };

    return (
        <div className="movie-comment-card-wrapper">
            <div className="movie-comment-header">
                {credentials.role === "admin"
                    ? <div>
                        <IconButton color="error" onClick={() => handleDelete(comment.id)} sx={{ width: 20, height: 20 }}>
                            <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </div>
                    : null
                }
                
                <div className="movie-comment-user-info-wrapper">
                    userDetails
                </div>
            </div>
            <div className="movie-comment-message">
                {comment.message.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </div>

            <div className="movie-comment-date">
                {comment.dateOfPosting}
            </div>
            
        </div>
    )
}
export default MovieComment;