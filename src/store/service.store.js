export const setServerStatus = (status)=>{
    window.localStorage.setItem('serverStatus', status);
}

export const getServerStatus = ()=>{
    return window.localStorage.getItem('serverStatus');
}