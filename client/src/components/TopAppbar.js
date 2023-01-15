import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { logoutHandler } from '../utils/actions';
import { Box } from '@mui/material';
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const TopAppbar = ({ open, setOpen }) => {
    let nav = useNavigate();
    let role = Number(localStorage.getItem('role'));
    let hasAdminRole = (role === 1 && "Super Admin") || (role === 2 && "Company Admin") || (role === 3 && "Manufacturer Admin");

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    return (
        <div>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        onClick={() => nav('/ls-admin')}
                        className='direction'
                        sx={{ cursor: 'pointer', gap: 1 }}
                    >
                        <AdminPanelSettingsOutlinedIcon fontSize='large' />
                        {hasAdminRole}
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 20,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                        onClick={logoutHandler}
                    >
                        <LogoutIcon />
                        <Typography>Logout</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default TopAppbar;