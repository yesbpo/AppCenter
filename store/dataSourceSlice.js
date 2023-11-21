import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

// Initial state
const initialState = {
    uid: 0,
    name: "",
    group: "",
    type: "",
    sentCount: 0,
    api: ""
}

// Actual Slice
export const dataSourceSlice = createSlice({
    name: "dataSource",
    initialState,
    reducers: {
        // Action to set the UID
        setUid(state, action) {
            state.uid = action.payload;
        },

        // Action to set the name
        setName(state, action) {
            state.name = action.payload;
        },

        // Action to set the group
        setGroup(state, action) {
            state.group = action.payload;
        },

        // Action to set the type
        setType(state, action) {
            state.type = action.payload;
        },

        // Action to set the type
        setAPI(state, action) {
            state.api = action.payload;
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

export const { setUid, setName, setGroup, setType, setAPI } = dataSourceSlice.actions;

export const selectDatasourceUID = (state) => state.dataSource.uid;
export const selectDatasourceName = (state) => state.dataSource.name;
export const selectDatasourceSentCount = (state) => state.dataSource.sentCount;
export const selectDatasourceType = (state) => state.dataSource.type;
export const selectDatasourceAPI = (state) => state.dataSource.api;

export default dataSourceSlice.reducer;
