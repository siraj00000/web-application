const { default: API } = require("../API");
const { token } = require("../utils/actions");

export const ProtectAuth = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token) return false;
            const response = await API({
                method: 'GET',
                url: `/api/auth/protect-auth`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            // Persist Auth User Role
            resolve(response?.data.user);
        } catch (error) {
            reject(error?.response.data.error);
        }
    });
};