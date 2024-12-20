export const setInputValue = (field, value) => ({
    type: 'SET_INPUT_VALUE',
    payload: { field, value },
});

export const restoreInputValue = () => ({
    type: 'RESTORE_INPUT_VALUE',
    payload: { },
});

export const setError = (field,value)=>({
    type:'SET_ERROR',
    payload:{field,value}
})