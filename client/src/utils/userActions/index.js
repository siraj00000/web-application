import API from "../../API";

export const verifyDSN = async (token, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'POST', url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};

export const userAuthenticationAction = async (url, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'POST',
                url,
                data,
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};

export const actionPost = async (url, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'POST',
                url,
                data,
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};

