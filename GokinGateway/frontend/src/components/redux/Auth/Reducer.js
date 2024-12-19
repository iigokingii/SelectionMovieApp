const initialState = {
    credentials:{}
};

const credentialReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CREDENTIALS':
            return {
                ...state,
                credentials: action.payload
            };
        default:
            return state;
    }
};

export default credentialReducer;