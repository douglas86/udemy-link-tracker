import cookie from 'js-cookie';
import Router from 'next/router';

// set in cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1,
        });
    }
};

// remove from cookie
export const removeCookie = (key) => {
    if (process.browser) {
        cookie.remove(key);
    }
};

// get from cookie such as stored token
// will be useful when we need to make request to server with auth token
export const getCookie = (key, req) => {
    // if (process.browser) {
    //     return cookie.get('token');
    // }
    return process.browser
        ? getCookieFromBrowser(key)
        : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
    return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
    if (!req.headers.cookie) {
        return undefined;
    }

    // console.log('req.headers.cookie', req.headers.cookie);

    let token = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith(`${key}=`));
    if (!token) {
        return undefined;
    }
    let tokenValue = token.split('=')[1];
    // console.log('getCookieFromServer', tokenValue);
    return tokenValue;
};

// set in localStorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// remove from localStorage
export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
};

// authenticate user by passing data in cookie and localStorage during signin
export const authenticate = (response, next) => {
    setCookie('token', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
};

// access user info from localStorage
export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
};

export const logout = () => {
    removeCookie('token');
    removeLocalStorage('user');
    Router.push('/login');
};
