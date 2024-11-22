// import { io } from "socket.io-client";

// export const base_url = 'http://185.74.4.138:8080/api/';
export const base_url = 'https://socket.qrpay.uz/api/';
// export const socket = io('https://socket.qrpay.uz', {
//       secure: true,
//       transports: ['websocket', 'polling'], // WebSocket va Pollingni qo'llash
//     });

export const getMeUrl = `${base_url}user/me`;

// USER CONTROLLER
export const user_register = `${base_url}user/register`;
export const user_login = `${base_url}user/login`;
export const bank_login = `${base_url}user/bank-login`;
export const set_socket = `${base_url}user/save-socket-id?socketId=`;
export const user_sendCode = `${base_url}user/send-code`;
export const checkPhoneUrl = `${base_url}user/check-phone?phone=`; //
export const user_request = `${base_url}request/save`;
export const user_edit = `${base_url}user/update`;
export const user_merchant = `${base_url}user/page`;
export const user_terminal = `${base_url}user/terminal`;
export const user_edit_status = `${base_url}user/user-active`;
export const user_terminal_add = `${base_url}terminal/add-terminal-user`;
export const user_terminal_delete = `${base_url}terminal/delete-terminal-user`;
export const user_merchant_update = `${base_url}user/add-seller`;

// TERMINAL CONTROLLER
export const terminal_create = `${base_url}terminal/create`;
export const terminal_get = `${base_url}terminal/list`;
export const terminal_get_list = `${base_url}terminal/select-terminal-list`;
export const terminal_update = `${base_url}terminal/update/`;
export const terminal_isActive = `${base_url}terminal/deactive/`;
export const terminal_search = `${base_url}user/select`;

// ORDER CONTROLLER
export const order_create = `${base_url}payment/create`;
export const seller_order_get = `${base_url}payment/list/for/seller`;
export const terminal_order_get = `${base_url}payment/list/for/terminal`;
export const admin_order_get = `${base_url}payment/list/for/admin`;
export const order_cancel = `${base_url}payment/cancel?orderId=`;
export const order_confirm = `${base_url}payment/confirm?orderId=`;
export const order_get_by_id = `${base_url}payment/one/`;
export const order_stats = `${base_url}payment/statistics/filter/admin`;
export const order_stats_seller_and_terminal = `${base_url}payment/statistics/filter/seller-or-terminal`;

// Notification CONTROLLER
export const delete_notification = `${base_url}notification/delete`;
export const isRead_notification = `${base_url}notification/is-read`;
export const admin_notification = `${base_url}notification/for-admin`;
export const seller_notification = `${base_url}notification/for-seller`;
export const terminal_notification = `${base_url}notification/for-terminal`;
export const admin_notification_count = `${base_url}notification/count/for-admin`;
export const seller_notification_count = `${base_url}notification/count/for-seller`;
export const terminal_notification_count = `${base_url}notification/count/for-terminal`;

// REQUEST CONTROLLER
export const requestSave = `${base_url}request/save`;
export const requestUpdateStatus = `${base_url}request/change-status`;
export const requestGetAdmin = `${base_url}request`;

// WORDS CONTROLLER
export const words_get = `${base_url}words?status=`;
export const words_put = `${base_url}words/edit`;
export const words_post = `${base_url}words/save?webOrMobile=`;
export const words_post_language = `${base_url}words/save/language`;
export const words_get_language = `${base_url}words/language?webOrMobile=`;
export const words_get_data = `${base_url}words/web-or-mobile?status=`;

// STATISTIC CONTROLLER
export const get_admin_statistic = `${base_url}statistics/admin`;
export const get_seller_statistic = `${base_url}statistics/seller`;
export const get_admin_request_web = `${base_url}statistics/admin/request-web`;
export const get_month_statistic = `${base_url}statistics/month`;
export const get_payment_statistic_forSeller = `${base_url}statistics/payment`;
export const get_year = `${base_url}statistics/year`;
export const download_file = `${base_url}download`;
export const download_interval = `${base_url}download/interval`;

// RATE CONTROLLER
export const rate_get = `${base_url}rate`;
export const rate_put = `${base_url}rate/`;
export const rate_post = `${base_url}rate?status=`;
export const rate_delete = `${base_url}rate/`;
export const rate_select = `${base_url}rate/select-status`;
export const rate_rating = `${base_url}rate/online-rate`;
