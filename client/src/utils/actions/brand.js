import API from "../../API";

// Insert Brand
export const insertBrand = async (token, detail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = API.post("http://54.213.140.206/api/insert-brand", detail, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};

// Update Brand
export const updateBrand = async (id, token, detail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = API.put(`/api/update-brand/${id}`, detail, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};


// Update Images
export const updateImagesIntoDB = async (id, token, public_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = API.put(`/api/update-image/${id}`, public_id, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};



export const uploadBrandImageAndVideo = async (token, detail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = API.post("http://54.213.140.206/api/upload", detail, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};

// Fetch Brand
export const fetchBrands = async (token, url) => {
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

// Delete Image and Video From Cloudinary
export const deleteContentFromCloudinary = async (url, token, imageList) => {
    for (let index = 0; index < imageList.length; index++) {
        const public_id = imageList[index]?.public_id;
        await API.delete(url, public_id, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
    }
};