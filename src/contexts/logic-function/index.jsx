import axios from "axios";
import {consoleClear, toastMessage} from "../toast-message";
import {config} from "../token";
import {requestUpdateStatus, user_edit_status} from "../api";
import toast from "react-hot-toast";

// request update status
export const updateRequestStatus = async ({reqID, status, getFunction}) => {
    try {
        const {data} = await axios.post(requestUpdateStatus, {
            id: reqID,
            status: status
        }, config)

        if(data.error?.code) toastMessage(data.error?.code)
        else {
            if (getFunction) getFunction()
            toast.success('Task completed successfully')
        }
    } catch (err) {
        // console.log(err)
    } finally {
    consoleClear()
    }
}


export const updateUserStatus = async ({userId, status, getFunction}) => {
    try {
        const {data} = await axios.post(`${user_edit_status}?userId=${userId}&status=${status}`, {}, config)

        if(data.error?.code) toastMessage(data.error?.code)
        else {
            if (getFunction) getFunction()
            toast.success('Task completed successfully')
        }
    } catch (err) {
        // console.log(err)
    } finally {
    consoleClear()
    }
}