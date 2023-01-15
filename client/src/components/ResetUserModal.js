import React from 'react';
import { Button, DialogTitle, Dialog, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Inputbox from '../helper/inputbox';
import { resetUserPassword } from '../utils/actions/companyData';
import { token } from '../utils/actions';
import './component.css';


export default function ResetPasswordDialogBox({ email }) {
    const [open, setOpen] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [status, setStatus] = React.useState({ success: null, msg: '' });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    const cleanStates = () => {
        setTimeout(() => {
            setStatus({ success: null, msg: '' });
            setPassword('');
            setOpen(false);
        }, 2000);
    };

    const handleSubmit = () => {
        if (password?.length < 6) return setStatus({ success: false, msg: "Password must have 6 digits atleast !!" });
        resetUserPassword(token, '/api/auth/resetpassword-sub-admin', { email, password })
            .then(res => {
                setStatus({ success: res.data?.success, msg: res.data?.msg });
                cleanStates();
            }).catch(error => {
                setStatus({ success: false, msg: error });
            });
    };

    return (
        <div>
            <EditIcon sx={{ cursor: 'pointer' }} onClick={handleClickOpen} />
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Reset Password</DialogTitle>
                <Box className='dialog-box'>
                    <Inputbox
                        type={'password'}
                        val={password}
                        onChangeVal={setPassword}
                        req
                    />
                    {status.msg !== '' &&
                        <h6 className={status.success ? 'success-msg' : 'error-msg'}>{status.msg}</h6>
                    }
                    <Button
                        onClick={handleSubmit}
                        variant='contained'
                        sx={{ marginTop: '20px', width: '100%' }}>Save Changes</Button>
                </Box>
            </Dialog>
        </div>
    );
}
