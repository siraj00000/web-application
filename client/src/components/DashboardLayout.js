import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import TopAppbar from './TopAppbar';
import AppDrawer from './Drawer';
import BreadCrumbs from './BreadCrumbs';

export default function DashboardLayout(props) {
    const [open, setOpen] = React.useState(false);
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <TopAppbar open={open} setOpen={setOpen} />
            <AppDrawer open={open} setOpen={setOpen} />
            <Box sx={{ width: '100%', margin: "8% 5%", }}>
                <BreadCrumbs />
                <Box sx={{ marginTop: '1%', width: '100%' }}>{props.children}</Box>
            </Box>
        </Box>
    );
}
