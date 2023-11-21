import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

// Initial state
const initialState = {
    uid: 0,
    message: "",
    approved: false,
    sentCount: 0,
    attachment: "",
}

// Actual Slice
export const templateSlice = createSlice({
    name: "template",
    initialState,
    reducers: {
        // Action to set the UID
        setUid(state, action) {
            state.uid = action.payload;
        },
        
        // Action to set the message
        setMessage(state, action) {
            state.message = action.payload;
        },
        
        // Action to set approveState
        setApproved(state, action) {
            state.approved = action.payload;
        },
        
        // Action to set sentCount
        setSentCount(state, action) {
            state.sentCount = action.payload;
        },
        
        // Action to set attachment must be already in Base64
        setAttachment(state, action) {
            state.attachment = action.payload;
        },
        
        // Action to set the whole template object.
        setCurrentTemplate(state, action) {
            Object.assign(state, action.payload);
        },
        
        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.auth,
                };
            },
        }
    }
});

export const { setUid, setMessage, setApproved, setSentCount, setAttachment, setCurrentTemplate } = templateSlice.actions;

export const selectTemplateUID = (state) => state.persistedReducer.template.uid;
export const selectTemplateMessage = (state) => state.persistedReducer.template.message;
export const selectTemplateApproved = (state) => state.persistedReducer.template.approved;
export const selectTemplateSentCount = (state) => state.persistedReducer.template.sentCount;
export const selectTemplateAttachment = (state) => state.persistedReducer.template.attachment;

export default templateSlice.reducer;
