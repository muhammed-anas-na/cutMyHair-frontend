import axiosInstance from '../config/axiosInstance.js';
import {
  OWNER_SEND_OTP_API,
  OWNER_VERIFY_OTP_API,
  OWNER_ADD_SALON_API,
  OWNER_GET_SALON_BY_ID_API,
  OWNER_GET_SALON_DETAILS_BY_ID_API,
  UPDATE_NUMBER_OF_SEATS_API,
  UPDATE_WORKING_HOUR_API,
  ADD_SERVICE_FOR_SALON_API,
  GET_APPOINTMENTS_OF_SALON_API,
  ADD_NEW_CATEGORY_API,
  GET_DASHBOARD_DATA_API,
  ADD_NEW_APPOINMENT_API
} from '@/endpoints/index.js';

// Send OTP Function for Owner
export const OWNER_SEND_OTP_FN = async (phone_number,from) => {
  try {
    return await axiosInstance.post(OWNER_SEND_OTP_API, { phone_number, from });
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

// Verify OTP Function for Owner
export const OWNER_VERIFY_OTP_FN = async (name, otp, from = '') => {
  try {
    return await axiosInstance.post(OWNER_VERIFY_OTP_API, { name, otp, from });
  } catch (err) {
    return err;
  }
};

// Add Salon Function
export const OWNER_ADD_SALON_FN = async (salonData) => {
  try {
    return await axiosInstance.post(OWNER_ADD_SALON_API, salonData);
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

// Get Salon by Owner ID Function
export const OWNER_GET_SALON_BY_ID_FN = async (owner_id) => {
  try {
    return await axiosInstance.post(OWNER_GET_SALON_BY_ID_API, { owner_id });
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

// Get Salon Details by Salon ID Function
export const OWNER_GET_SALON_DETAILS_BY_ID_FN = async (salon_id) => {
  try {
    return await axiosInstance.post(OWNER_GET_SALON_DETAILS_BY_ID_API, { salon_id });
  } catch (err) {
    return err.response ? err.response.data : err;
  }
};

export const CREATE_SALON_FN = async(
  user_id,
  locationName,
  locationText,
  salonName,
  contactNumber,
  address,
  imageUrls,
  latitude,
  longitude
) => {
  try {
    return await axiosInstance.post(OWNER_ADD_SALON_API, {owner_id: user_id,locationName, locationText, salonName, contactNumber, address, imageUrls, latitude, longitude });
  } catch (err) {
    return err
  }
}

export const UPDATE_NUMBER_OF_SEATS_FN = async(salon_id, seats)=>{
  try {
    return await axiosInstance.post(UPDATE_NUMBER_OF_SEATS_API, {salon_id, seats});
  } catch (err) {
    return err
  }
}
export const UPDATE_WORKING_HOUR_FN = async(salon_id, workingHour)=>{
  try {
    return await axiosInstance.post(UPDATE_WORKING_HOUR_API, {salon_id, workingHour});
  } catch (err) {
    return err
  }
}

export const GET_OWNER_SALON_FN = async(user_id,fields)=>{
  try {
    return await axiosInstance.post(OWNER_GET_SALON_BY_ID_API, {owner_id: user_id, fields});
  } catch (err) {
    return err
  }
}

export const FETCH_SALON_DETAILS_BY_ID_FN = async(salon_id)=>{
  try {
    return await axiosInstance.post(OWNER_GET_SALON_DETAILS_BY_ID_API, {salon_id});
  } catch (err) {
    return err
  }
}

export const GET_APPOINTMENTS_OF_SALON_FN = async(salon_id, date)=>{
  try {
    return await axiosInstance.post(GET_APPOINTMENTS_OF_SALON_API, {salon_id, date});
  } catch (err) {
    return err
  }
}

// Service Function: ADD_SERVICE_FOR_SALON_FN
export const ADD_SERVICE_FOR_SALON_FN = async (salon_id, name, description, price, duration, category, status, category_id) => {
  try {
    console.log("IDDD===>",category_id)
    const response = await axiosInstance.post(ADD_SERVICE_FOR_SALON_API, {
      salon_id,
      name,
      description,
      price,
      duration,
      category,
      status,
      category_id: category_id || null // Explicitly send null if no category_id
    });
    return response;
  } catch (err) {
    console.error('API Error:', err.response?.data || err.message);
    throw err;
  }
};


export const ADD_NEW_CATEGORY_FN = async(data)=>{
  try {
    return await axiosInstance.post(ADD_NEW_CATEGORY_API, data);
  } catch (err) {
    return err
  }
}

export const GET_DASHBOARD_DATA_FN=async(userId)=>{
  try {
    return await axiosInstance.post(GET_DASHBOARD_DATA_API, {userId});
  } catch (err) {
    return err
  }
} 

export const ADD_NEW_APPOINMENT_FN = async(newAppointment)=>{
  try {
    return await axiosInstance.post(ADD_NEW_APPOINMENT_API, newAppointment);
  } catch (err) {
    return err
  }
}