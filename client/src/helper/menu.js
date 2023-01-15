import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';

const drawerMenuList = (navigate) => {
    let role = Number(localStorage.getItem('role'));

    const SUPER_ADMIN = [
        {
            routeName: "Admin",
            Icon: SupervisorAccountOutlinedIcon,
            handler: () => navigate("/ls-admin/admins")
        },
        {
            routeName: "Category",
            Icon: GridViewIcon,
            handler: () => navigate("/ls-admin/category")
        },
        {
            routeName: "Sub Category",
            Icon: ListAltIcon,
            handler: () => navigate("/ls-admin/subcategory")
        },
        {
            routeName: "Brand",
            Icon: DiamondOutlinedIcon,
            handler: () => navigate("/ls-admin/brands")
        }
    ];

    const COMPANY_ADMIN = [
        {
            routeName: "Product",
            Icon: AddBoxOutlinedIcon,
            handler: () => navigate("/ls-admin/products")
        },
    ];

    const MANUFACTURER_ADMIN = [
        {
            routeName: "Label",
            Icon: LabelOutlinedIcon,
            handler: () => navigate("/ls-admin/label")
        },
    ];

    if (role === 1) return SUPER_ADMIN;
    else if (role === 2) return COMPANY_ADMIN;
    else if (role === 3) return MANUFACTURER_ADMIN;
};

export default drawerMenuList;