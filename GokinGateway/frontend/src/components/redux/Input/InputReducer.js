const initialState = {
    inputValues: {
        email: '',
        username: '',
        password: '',
        repeatpassword:'',
    },
    errorMsg:{
        passwordError:'',
        passwordsError:'',
        emailError:'',
        usernameError:''
    },
};

const inputReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_INPUT_VALUE':
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    [action.payload.field]: action.payload.value,
                },
            };
        case 'SET_ERROR':
            return{
                ...state,
                errorMsg:{
                    ...state.errorMsg,
                    [action.payload.field]:action.payload.value
                }
            }
        default:
            return state;
    }
};

export default inputReducer;