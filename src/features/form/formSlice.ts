import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step1: {},
    step2: {},
    step3: {},
    step4: {}
};

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        setStep1: (state, action) => {
            state.step1 = action.payload;
        },
        setStep2: (state, action) => {
            state.step2 = action.payload;
        },
        setStep3: (state, action) => {
            state.step3 = action.payload;
        },
        setStep4: (state, action) => {
            state.step4 = action.payload;
        },
        resetForm: (state) => {
            state.step1 = {};
            state.step2 = {};
            state.step3 = {};
            state.step4 = {};
        },
    },
});

export const { setStep1, setStep2, setStep3, setStep4, resetForm } = formSlice.actions;
export default formSlice.reducer;
