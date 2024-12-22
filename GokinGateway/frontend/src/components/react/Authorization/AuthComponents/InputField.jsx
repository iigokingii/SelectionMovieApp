import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInputValue } from "../../../redux/Input/action"; // Adjust the import path
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import FormHelperText from '@mui/material/FormHelperText';

const InputField = ({ field }) => {
    const dispatch = useDispatch();
    let newfield = field.toLowerCase().replace(/\s+/g, '');
    let newError = newfield+"Error";
    const value = useSelector((state) => state.inputReducer.inputValues[newfield]);
    let error = useSelector((state)=>state.inputReducer.errorMsg[newError]);
    const handleChange = (event) => {
        dispatch(setInputValue(newfield, event.target.value));
    };

    const handleError = ()=>{
        if(error!=='')
            return error;
    }

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '265px', marginBottom: handleError() ? '0px' : '20px'}}>
                <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} fontSize="small"/>
                <TextField id="input-with-sx" label={field} value={value} onChange={handleChange} variant="standard" fullWidth/>
            </Box>
            <FormHelperText error sx={{marginLeft:'26px'}}>{handleError()}</FormHelperText>
        </div>
    );
};

export default InputField;