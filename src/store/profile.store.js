export const setAccessToken = (value)=>{
    window.localStorage.setItem('access_token', value);
}

export const getAccessToken = ()=>{
    return window.localStorage.getItem('access_token');
}

export const setProfileToken = (value)=>{
    window.localStorage.setItem('profile_token', value);
}

export const getProfileToken = ()=>{
    return window.localStorage.getItem('profile_token');
}