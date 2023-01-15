import API from "../../API";

// Fetch
export const fetchCategory = async (token, url) => {
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

// Delete
export const deleteColloction = async (url, token) => {
    API({
        method: 'DELETE',
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
};


/*-------------SUB CATEGORY-----------------*/
export const fetchSubCategory = async (token, url) => {
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

// Update Sub-Category 
export const updateSubCategory = async (url, token, reqBody) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await API({
                method: 'PUT',
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                data: reqBody
            });
            if (response) resolve(response);
            else reject(response);
        } catch (error) {
            reject(error);
        }
    });
};
