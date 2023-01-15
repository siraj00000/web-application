const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    document.location = "/ls-admin";
};

const enLogoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("endutoken");
    document.location = "/";
}

const removeStatus = func => setTimeout(() => func(""), 3000);

const token = localStorage.getItem('authToken');
const endutoken = localStorage.getItem("endutoken");
const role = Number(localStorage.getItem('role'));

export { logoutHandler, enLogoutHandler, removeStatus, token, endutoken, role };