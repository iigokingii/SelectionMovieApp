import React from "react";
import '../../../../static/Movie/MovieComment.css';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MovieComment = ({ comment, movieId }) => {
    const credentials = useSelector((state) => state.credentialReducer.credentials);
    console.log(comment);
    const handleDelete = (commentId) => {
        console.log("Удаление выполнено! ", {commentId, movieId} );
    };

    return (
        <div className="movie-comment-card-wrapper">
            <div className="movie-comment-header">
                {credentials.role === "admin"
                    ? <div>
                        <IconButton color="error" onClick={() => handleDelete(comment.id)} sx={{ width: 20, height: 20 }}>
                            <DeleteIcon sx={{ fontSize: 20, paddingTop:"6px" }} />
                        </IconButton>
                    </div>
                    : null
                }
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
                    </div>
                    : null}
                
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