
import axios from "axios";
import {
    POST_DATA_REQUEST,
    POST_DATA_SUCCESS,
    POST_DATA_FAILURE,
  } from "../constants";
  

export const loginUser = (email,password) => async (dispatch) =>  {

    try {
        dispatch({type:POST_DATA_REQUEST});

        axios.post("http://localhost:8080/users",{email, password}).then((res)=>{console.log("RES: ", res.data);});

        dispatch({
            type: POST_DATA_SUCCESS,
          });
    } catch (error) {
        dispatch({
            type: POST_DATA_FAILURE,
            payload: error.data.messages.severityMessageMap.ERROR[0].message,
          });
    }


}