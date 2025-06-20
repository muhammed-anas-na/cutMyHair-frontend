import axiosInstance from '../config/axiosInstance.js';
import {
  SEND_OTP_API,
  VERIFY_OTP_API,
  UPDATE_USER_LOCATION_API,
  GET_SALON_FEEDBACKS_API,
  GET_SALON_SERVICES_API,
  GET_LOCATION_NAME_BY_COORDINATES_API,
  GET_LOCATION_FROM_TEXT_API,
  GET_NEAREST_SALON_API,
  CREATE_ORDER_API,
  CONFIRM_BOOKING_API,
  GET_USER_BOOKINGS_BY_ID_API,
  GET_BOOKING_DETAIL_BY_ID_API,
  SEARCH_SALON_API,
  GET_TIME_SLOT_API,
  GET_ALL_SALONS_API,
  ADD_TO_FAVORITES_API,
  REMOVE_FROM_FAVORITES_API,
  GET_ALL_FAVOURITES_API,
  GET_BLOGS_API,
  GET_BLOG_BY_SLUG_API,
  FETCH_USER_DETAILS_API
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
export const VERIFY_OTP_FN = async (name, otp, from = '', otpId) => {
  try {
    const response = await axiosInstance.post(VERIFY_OTP_API, { name, otp, from, otpId });
    return response;
  } catch (err) {
    return err
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

export const GET_NEAREST_SALON_FN = async(latitude, longitude, user_id)=>{
  try{
    return await axiosInstance.post(GET_NEAREST_SALON_API, {latitude,longitude, user_id})
  }catch(err){
    return err
  }
}

export const CREATE_ORDER_FN = async(amount)=>{
  try{
    return await axiosInstance.post(CREATE_ORDER_API, {amount})
  }catch(err){
    return err
  }
}

export const CONFIRM_BOOKING_FN = async(bookingData)=>{
  try{
    return await axiosInstance.post(CONFIRM_BOOKING_API, bookingData)
  }catch(err){
    return err
  }
}

export const GET_USER_BOOKINGS_BY_ID_FN = async(user_id)=>{
  try{
    return await axiosInstance.post(GET_USER_BOOKINGS_BY_ID_API, {user_id})
  }catch(err){
    return err
  }
}

export const GET_BOOKING_DETAIL_BY_ID_FN = async(booking_id)=>{
  try{
    return await axiosInstance.post(GET_BOOKING_DETAIL_BY_ID_API, {booking_id})
  }catch(err){
    return err
  }
}

export const SEARCH_SALON_FN = async(searchParams)=>{
  try{
    return await axiosInstance.post(SEARCH_SALON_API, searchParams)
  }catch(err){
    return err
  }
}

export const GET_TIME_SLOTS_FN = async (salon_id, date, total_duration) => {
  try {
    return await axiosInstance.get(
      `${GET_TIME_SLOT_API}?salon_id=${salon_id}&date=${date}&total_duration=${total_duration}`
    );
  } catch (err) {
    console.error("Error fetching time slots:", err);
    return err;
  }
};


export const FETCH_ALL_SALONS_FN = async()=>{
  try {
    return await axiosInstance.get(GET_ALL_SALONS_API);
  } catch (err) {
    return err;
  }
}

export const ADD_TO_FAVORITES_FN = async(salon_id, user_id)=>{
  try {
    return await axiosInstance.post(ADD_TO_FAVORITES_API , {salon_id, user_id});
  } catch (err) {
    return err;
  }
}

export const REMOVE_FROM_FAVORITES_FN = async(salon_id, user_id)=>{
  try {
    return await axiosInstance.post(REMOVE_FROM_FAVORITES_API , {salon_id, user_id});
  } catch (err) {
    return err;
  }
}

export const GET_ALL_FAVOURITES_FN = async(user_id)=>{
  try{
    return await axiosInstance.post(GET_ALL_FAVOURITES_API, {user_id})
  }catch(err){
    return err;
  }
}


export const GET_BLOGS_FN = async()=>{
  try{
    return await axiosInstance.get(GET_BLOGS_API)
  }catch(err){
    return err;
  }
}

export const GET_BLOG_BY_SLUG_FN = async(slug)=>{
  try{
    return await axiosInstance.post(GET_BLOG_BY_SLUG_API, {slug})
  }catch(err){
    return err;
  }
}

export const FETCH_USER_DETAILS_FN = async(user_id)=>{
  try{
    return await axiosInstance.post(FETCH_USER_DETAILS_API, {user_id})
  }catch(err){
    return err;
  }
}