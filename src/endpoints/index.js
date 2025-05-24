
let BASE_URL;
if(process.env.NEXT_PUBLIC_ENVIRONMENT == 'dev'){
    BASE_URL = 'http://localhost:8000/api';
}else if(process.env.NEXT_PUBLIC_ENVIRONMENT == 'SAT'){
    BASE_URL - 'http://69.62.78.176:8000/api'
}else{
    BASE_URL = 'https://cutmyhair-backend.onrender.com/api';
}
const OWNER_BASE_URL = `${BASE_URL}/owner`;
const USER_BASE_URL = `${BASE_URL}/users`;
const BLOG_BASE_URL = `${BASE_URL}/blogs`;
// User-related endpoints
export const SEND_OTP_API = `${USER_BASE_URL}/send-otp`;
export const VERIFY_OTP_API = `${USER_BASE_URL}/verify-otp`;
export const UPDATE_USER_LOCATION_API = `${USER_BASE_URL}/update-user-location`;
export const GET_LOCATION_NAME_BY_COORDINATES_API = `${USER_BASE_URL}/get-location-name-by-coordinates`
export const GET_LOCATION_FROM_TEXT_API = `${USER_BASE_URL}/get-location-from-text`
export const CONFIRM_BOOKING_API = `${USER_BASE_URL}/confirm-booking`
export const GET_USER_BOOKINGS_BY_ID_API = `${USER_BASE_URL}/get-user-bookings`
export const GET_BOOKING_DETAIL_BY_ID_API = `${USER_BASE_URL}/get-booking-details`
export const FETCH_USER_DETAILS_API = `${USER_BASE_URL}/get-user-details`

// Salon-related endpoints for Users
export const GET_SALON_FEEDBACKS_API = `${USER_BASE_URL}/get-salon-feedbacks`;
export const GET_SALON_SERVICES_API = `${USER_BASE_URL}/get-salon-services`;
export const GET_NEAREST_SALON_API = `${USER_BASE_URL}/get-nearest-salon`;
export const SEARCH_SALON_API = `${USER_BASE_URL}/search`;
export const GET_TIME_SLOT_API = `${USER_BASE_URL}/get-time-slots`
export const ADD_TO_FAVORITES_API =  `${USER_BASE_URL}/add-to-favorites`
export const REMOVE_FROM_FAVORITES_API = `${USER_BASE_URL}/remove-from-favorites`
export const GET_ALL_FAVOURITES_API = `${USER_BASE_URL}/get-favorites`
// Owner-related endpoints
export const OWNER_SEND_OTP_API = `${OWNER_BASE_URL}/send-otp`;
export const OWNER_VERIFY_OTP_API = `${OWNER_BASE_URL}/verify-otp`;
export const GET_DASHBOARD_DATA_API = `${OWNER_BASE_URL}/get-dashboard-data`;
export const ADD_NEW_APPOINMENT_API = `${OWNER_BASE_URL}/add-new-appoinment-by-owner`;
export const GET_OWNER_SETTINGS_DATA_API = `${OWNER_BASE_URL}/get-owner-settings`;

// Salon Management Endpoints for Owners
export const OWNER_ADD_SALON_API = `${OWNER_BASE_URL}/add-salon`;
export const OWNER_GET_SALON_BY_ID_API = `${OWNER_BASE_URL}/get-salon-by-owner-id`;
export const OWNER_GET_SALON_DETAILS_BY_ID_API = `${OWNER_BASE_URL}/get-salon-detail-by-id`;
export const UPDATE_NUMBER_OF_SEATS_API = `${OWNER_BASE_URL}/update-number-of-seats`;
export const UPDATE_WORKING_HOUR_API = `${OWNER_BASE_URL}/update-working-hours`;
export const ADD_SERVICE_FOR_SALON_API = `${OWNER_BASE_URL}/add-service`;
export const GET_APPOINTMENTS_OF_SALON_API = `${OWNER_BASE_URL}/get-appoinments-of-salon`;
export const ADD_NEW_CATEGORY_API = `${OWNER_BASE_URL}/add-category`;
export const GET_REPORT_DATA_API = `${OWNER_BASE_URL}/get-reports`
export const Add_NEW_EMPLOYEE_API = `${OWNER_BASE_URL}/add-stylist`
export const GET_STYLIST_DATA_API = `${OWNER_BASE_URL}/get-stylist`
export const GET_FINANCE_DATA_API = `${OWNER_BASE_URL}/get-finance-report`
export const UPDATE_SERVICE_API = `${OWNER_BASE_URL}/update-services`
export const UPDATE_CATEGORY_API = `${OWNER_BASE_URL}/update-category`
export const DELETE_STYLIST_API = `${OWNER_BASE_URL}/delete-stylist`
export const UPLOAD_IMAGE_BACKEND_API = `${OWNER_BASE_URL}/update-salon-images`
export const DELETE_IMAGE_BACKEND_API = `${OWNER_BASE_URL}/delete-salon-images`

//Owner Transaction Related
export const WITHDRAW_AMOUNT_API = `${OWNER_BASE_URL}/withdraw-amount`


//User Payment
export const CREATE_ORDER_API = `${USER_BASE_URL}/create-razorpay-order`;



//SEO
export const GET_ALL_SALONS_API = `${USER_BASE_URL}/get-all-salons`;
export const GET_BLOGS_API = `${BLOG_BASE_URL}/get-all-blogs`;
export const GET_BLOG_BY_SLUG_API = `${BLOG_BASE_URL}/get-blog-by-slug`;