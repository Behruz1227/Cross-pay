export const config = {
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    }
}

export const imgConfig = {
    headers: {
        'multipart/type': 'multipart/form-data',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    }
}

export const setConfig = () => config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`
export const setImgConfig = () => imgConfig.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`