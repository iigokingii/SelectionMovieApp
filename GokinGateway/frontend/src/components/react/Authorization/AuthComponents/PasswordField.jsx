import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInputValue, setError } from "../../../redux/Input/action"; // Adjust the import path
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';

const PasswordField = ({ field, marginBtm }) => {
    const dispatch = useDispatch();
    let newfield = field.toLowerCase().replace(/\s+/g, '');
    const value = useSelector((state) => state.inputReducer.inputValues[newfield]);
    let passwordsError = useSelector((state)=>state.inputReducer.errorMsg['passwordsError'])
    let passwordError = useSelector((state)=>state.inputReducer.errorMsg['passwordError'])
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (event) => {
        const newValue = event.target.value;
        console.log({newfield, newValue})
        dispatch(setInputValue(newfield, newValue));
    };

    const handleError = ()=>{
        if(newfield==='repeatpassword' && passwordsError!=='')
            return passwordsError;
        if(newfield==='password' && passwordError!=='')
            return passwordError;
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: marginBtm }} variant="standard">
                <LockIcon sx={{ color: 'action.active', marginRight: '8px', marginBottom: handleError() ? '23px' : '4px' }} fontSize="small" />
                <FormControl sx={{ width: '233px' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">{field}</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        }
                        value={value}
                        onChange={handleChange}
                    />
                    <FormHelperText error>{handleError()}</FormHelperText>
                </FormControl>
            </Box>
        </div>
    );
}

export default PasswordField;