/* eslint-disable import/no-anonymous-default-export */
import {
    GET_DATA_REQUEST,
    GET_DATA_SUCCESS,
    GET_DATA_FAILURE,
    UPDATE_POST_REQUEST,
    UPDATE_POST_SUCCESS,
    UPDATE_POST_FAILURE,
    POST_DATA_FAILURE,
    POST_DATA_REQUEST,
    POST_DATA_SUCCESS,
  } from "../../constants";
  
  export const initialState = {
    isLoading: false,
    error: null,
    updatePassword: {
      isLoading: false,
      error: null,
    },
  };
  
  export default function (state = initialState, action) {
    switch (action.type) {
      case GET_DATA_REQUEST:
        return { ...state, isLoading: true };
      case GET_DATA_SUCCESS:
        return { ...state, ...action.payload, isLoading: false };
      case GET_DATA_FAILURE:
        return { ...state, error: action.payload, isLoading: false };
  
      case POST_DATA_REQUEST:
        return { ...state, isLoading: true };
      case POST_DATA_SUCCESS:
        return {
          ...state,
          ...action.payload,
          isLoading: false,
          error: null,
        };
      case POST_DATA_FAILURE:
        return { ...state, error: action.payload, isLoading: false };
  
      case UPDATE_POST_REQUEST:
        return {
          ...state,
          updatePassword: {
            isLoading: true,
          },
        };
      case UPDATE_POST_SUCCESS:
        return {
          ...state,
          isLoading: false,
        };
      case UPDATE_POST_FAILURE:
        return {
          ...state,
          updatePassword: {
            error: action.payload,
            isLoading: false,
          },
        };
  
      default:
        return state;
    }
  }

  