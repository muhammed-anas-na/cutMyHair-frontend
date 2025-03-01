import axiosInstance from '../config/axiosInstance.js';
import {
  SEND_OTP_API,
  VERIFY_OTP_API,
  UPDATE_USER_LOCATION_API,
  GET_SALON_FEEDBACKS_API,
  GET_SALON_SERVICES_API,
  GET_LOCATION_NAME_BY_COORDINATES_API,
  GET_LOCATION_FROM_TEXT_API,
  GET_NEAREST_SALON_API
} from '@/endpoints/index.js';

// Send OTP Function
export const SEND_OTP_FN = async (phone_number, from='') => {
  try {
    return await axiosInstance.post(SEND_OTP_API, { phone_number, from });
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

// Verify OTP Function
export const VERIFY_OTP_FN = async (name, otp, from = '') => {
  try {
    const response = await axiosInstance.post(VERIFY_OTP_API, { name, otp, from });
    return response;
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

// Update User Location Function
export const UPDATE_USER_LOCATION_FN = async (user_id, latitude, longitude) => {
  try {
    return await axiosInstance.post(UPDATE_USER_LOCATION_API, { user_id, latitude, longitude });
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

// Get Salon Feedbacks Function
export const GET_SALON_FEEDBACKS_FN = async (salon_id) => {
  try {
    return await axiosInstance.post(GET_SALON_FEEDBACKS_API, { salon_id });
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

// Get Salon Services Function
export const GET_SALON_SERVICES_FN = async (salon_id) => {
  try {
    return await axiosInstance.post(GET_SALON_SERVICES_API, { salon_id });
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

export const GET_LOCATION_NAME_BY_COORDINATES_FN = async(latitude, longitude)=>{
  try{
    return await axiosInstance.post(GET_LOCATION_NAME_BY_COORDINATES_API, {latitude, longitude})
  }catch(err){
    return err.response ? err.response.data : err
  }
}

export const GET_LOCATION_FROM_TEXT_FN = async(text)=>{
  try{
    return await axiosInstance.post(GET_LOCATION_FROM_TEXT_API, {text})
  }catch(err){
    return err.response ? err.response.data : err
  }
}

export const GET_NEAREST_SALON_FN = async(latitude, longitude)=>{
  try{
    return await axiosInstance.post(GET_NEAREST_SALON_API, {latitude,longitude})
  }catch(err){
    return err
  }
}