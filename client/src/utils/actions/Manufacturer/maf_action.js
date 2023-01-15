import API from "../../../API";

export const fetchLabels = async (token, url, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'POST', url, data,
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

export const fetchBrandByEmail = async (token, url, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'POST', url, data,
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

export const fetchProductByBrandId = async (token, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'GET', url,
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

export const insertLabelToDB = (token, url, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'POST', url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                data
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};

export const fetchSubCtgByCtg = async (token, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'GET',
                url,
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

export const fetchSubCategory = async (token, url, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'GET',
                url,
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

export const insertProductToDB = (token, url, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'POST', url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                data
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};