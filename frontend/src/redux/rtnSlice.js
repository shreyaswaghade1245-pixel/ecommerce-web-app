import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name:'realTimeNotification',
    initialState: {
        likeNotification:[],
        followNotification:[]
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type == 'like'){
                state.likeNotification.push(action.payload);
            }else if(action.payload.type == 'dislike'){
                state.likeNotification = state.likeNotification.filter((item)=> item.userId != action.payload.userId);
            }
        },
        setFollowNotification:(state,action)=>{
            if(action.payload.type == 'follow'){
                state.followNotification.push(action.payload);
            }else if(action.payload.type == 'unfollow'){
                state.followNotification = state.followNotification.filter((item)=> item.userId != action.payload.userId);
            }
        }
    }
})

export const {setLikeNotification, setLikeArray, setFollowNotification} = rtnSlice.actions;
export default rtnSlice.reducer; 