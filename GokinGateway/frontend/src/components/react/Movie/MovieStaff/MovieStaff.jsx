import React from "react";
import '../../../../static/Movie/MovieStaff.css';

const MovieStaff = ({staff})=>{
    return(
        <div className="movie-staff-wrapper">
            {staff.name} {staff.surname} {staff.middleName}
        </div>
    )
}
export default MovieStaff;