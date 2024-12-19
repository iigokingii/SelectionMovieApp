import React from "react";
import '../../../../static/Movie/MovieDetail.css';

const MovieDetail = ({movieDetailName, movieDetail})=>{
    return(
        <div className="movie-detail-wrapper">
            <div className="movie-detail-name">
                {movieDetailName}
            </div>
            <div className="movie-detail">
                {movieDetail}
            </div>
        </div>
    )
}
export default MovieDetail;