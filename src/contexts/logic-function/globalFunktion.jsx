import axios from 'axios';
import {consoleClear, toastMessage} from 'contexts/toast-message';
import {config} from 'contexts/token';
import {getMeUrl} from "../api";
import toast from 'react-hot-toast';

export const userGetMe = async ({setData, token}) => {
    try {
        const {data} = await axios.get(getMeUrl, token ? {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        } : config)
        if (data?.error?.code) setData(null)
        else setData(data.data)
    } catch (err) {
        setData(null)
    } finally {
    consoleClear()
    }
}

export async function globalGetFunction({url, setData, setLoading, setTotalElements, page, size = 10, token}) {
    let getUrl = url; // Boshlang'ich URL
    if (setLoading) setLoading(true); // Agar setLoading funksiyasi mavjud bo'lsa, uni chaqiramiz
    try {
        const params = [];

        if (page) params.push(`page=${page}&size=${size}`);

        // Agar params mavjud bo'lsa, URLga qo'shamiz
        if (params.length > 0) {
            getUrl = `${url}?${params.join("&")}`;
        }

        const {data} = await axios.get(getUrl, token ? {
            headers: {Authorization: `Bearer ${token}`,}
        } : config);

        if (data?.error?.code) setData(null);
        else {
            setData(data.data);

            if (setTotalElements && data.data.totalElements) {
                setTotalElements(data.data.totalElements);
            }
        }
    } catch (error) {
        setData(null);
    consoleClear()
    } finally {
        if (setLoading) setLoading(false);
    consoleClear()
    }
}


export async function globalPostFunction({url, postData, setLoading, getFunction, setData}) {
    if (setLoading) setLoading(true);
    try {
        const {data} = await axios.post(url, postData, config)
        if (data?.error?.message) {
            toast.error(data.error.message)
            if (setData) setData(data.error)
        }
        else {
            toast.success("Task completed successfully")
            if (setData) setData(data.data)
            if (getFunction) getFunction()
        }
    } catch{
        if (setData) setData(null);
    } finally {
        if (setLoading) setLoading(false);
    consoleClear()
    }
}

export async function globaldeleteFunction({url, setLoading, getFunction}) {
    if (setLoading) setLoading(true);
    try {
        const {data} = await axios.delete(url, config)
        if (data?.error?.message) toast.error(data.error.message)
        else {
            toast.success("Task completed successfully")
            getFunction()
        }
    } catch{
    } finally {
        if (setLoading) setLoading(false);
    consoleClear()
    }
}

export async function globalPutFunction({url, putData, setLoading, getFunction, setResponse}) {
    try {
        if (setLoading) setLoading(true);
        const {data} = await axios.put(url, putData, config)
        if (data?.error?.message) toast.error(data.error.message)
        else {
            if (setResponse) setResponse(data.data)
            if (getFunction) getFunction()
            toast.success("Task completed successfully")
        }
    } catch (error) {
        // toast.error('Error during update operation:');
    } finally {
        if (setLoading) setLoading(false);
    consoleClear()
    }
}
