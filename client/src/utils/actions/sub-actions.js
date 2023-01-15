import API from "../../API";

export const downloadCSV = (token, url) => {
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

export const downloadProductCSV = (token, url, data) => {
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
            if (error.message) return reject(error.message);
            reject(error?.response.data.error);
        }
    });
};