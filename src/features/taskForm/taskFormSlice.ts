/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskFormState {
    customDeadline: boolean;
    offerDeadline: any;
    price: string;
    serviceId: string;
    serviceTitle: string;
    taskTitle: string;
    taskDescription: string;
    location: string;
    schedule: string;
    additionalInfo: string;
    photos: File[];
    video: File | null;
    estimatedTime: string;
}

const initialState: TaskFormState = {
    serviceId: "",
    serviceTitle: "",
    taskTitle: "",
    taskDescription: "",
    location: "",
    schedule: "",
    additionalInfo: "",
    photos: [],
    video: null,
    price: "",
    estimatedTime: "",
    customDeadline: false,
    offerDeadline: undefined
};

const taskFormSlice = createSlice({
    name: "taskForm",
    initialState,
    reducers: {
        updateTaskField: (
            state,
            action: PayloadAction<{ field: keyof TaskFormState; value: any }>
        ) => {
            const { field, value } = action.payload;
            (state[field] as any) = value;
        },
        setPhotos: (state, action: PayloadAction<File[]>) => {
            state.photos = action.payload;
        },
        setVideo: (state, action: PayloadAction<File | null>) => {
            state.video = action.payload;
        },
        resetTaskForm: () => initialState,
    },
});

export const {
    updateTaskField,
    setPhotos,
    setVideo,
    resetTaskForm,
} = taskFormSlice.actions;

export default taskFormSlice.reducer;