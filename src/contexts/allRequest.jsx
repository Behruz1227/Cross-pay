import axios from 'axios';

export const sliceNumber = (num) => {
    if ( num.length === 9) return `+${num}`;
    else return ''
};

export const apiRequest = async (method, url, data = null, setData) => {
    try {
        const res = await axios({
            method: method,
            url: url,
            data: data,
        });

        setData(res.data.body);
    } catch (error) {
        // console.error(`Error during ${method.toUpperCase()} request to ${url}:`, error);
        throw error;
    }
};

export const siteSecurity = () => {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey && (
            e.key === 'shift' ||
            e.key === 'i' ||
            e.key === 'I' ||
            e.key === 'j' ||
            e.key === 'J' ||
            e.keyCode === 74 ||
            e.keyCode === 85 ||
            e.keyCode === 73
        )) || e.key === 'F12') e.preventDefault();
    });
};