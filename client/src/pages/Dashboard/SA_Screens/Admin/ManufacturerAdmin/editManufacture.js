import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Checkbox from '@mui/material/Checkbox';
import '../../../../auth/auth.css';
import '../admin.css';

import CustomizeTitle from '../../../../../mui_theme/title';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateManufacturer } from '../../../../../utils/actions/companyData';
import { removeStatus, token } from '../../../../../utils/actions';
import Splash from '../../../../../components/splash';
import swal from 'sweetalert';

const EditManufactureAdmin = () => {
    let { state } = useLocation();
    let { data, id } = state;
    let nav = useNavigate();
    // Field States
    const [isLoading, setLoading] = useState(false);
    const [pincode, setPincode] = useState(data?.pincode);
    const [phone_one, setPhoneOne] = useState(0);
    const [phone_two, setPhoneTwo] = useState(0);
    const [registered_address, setRegisteredAddress] = useState('');
    const [manufacturer_active_status, setManufactureActiveStatus] = useState(data?.manufacturer_active_status);

    const [error, setError] = useState('');

    const updateHandler = async (e) => {
        e.preventDefault();
        let url = `api/update-manufacturer-admin/${id}`;
        try {
            setLoading(true);
            const reqBody = {
                pincode,
                manufacturer_active_status,
                phone_one,
                phone_two
            };
            updateManufacturer(url, token, reqBody)
                .then(res => {
                    swal({
                        title: "Success!",
                        text: res?.data?.msg,
                        icon: "success",
                        button: "Okay!",
                    }).then(() => {
                        nav('/ls-admin/admins', { replace: true });
                        setLoading(false);
                    });
                }).catch(error => {
                    setLoading(false);
                    setError(error?.response.data?.error);
                    removeStatus(setError);
                });
        } catch (error) {

        }
    };

    const handleChange = (event) => {
        setManufactureActiveStatus(event.target.checked);
    };

    if (isLoading) return <Splash loading={isLoading} />;

    return (
        <form className='form-sec' onSubmit={updateHandler}>
            <CustomizeTitle text={'Update Manufacturer'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form'>
                <div className='company_admin_form_field'>
                    <label>Pincode</label>
                    <input placeholder='392032' value={pincode || ''} onChange={e => setPincode(e.target.value)} required />
                </div>
                <div className='company_admin_form_field'>
                    <label>Registration Address</label>
                    <input placeholder='ABC street' value={registered_address} onChange={e => setRegisteredAddress(e.target.value)} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Phone 1</label>
                    <input placeholder='9132793293' value={phone_one || ''} onChange={e => setPhoneOne(e.target.value)} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Phone 2</label>
                    <input placeholder='9112793293' value={phone_two || ''} onChange={e => setPhoneTwo(e.target.value)} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Company Status</label>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControlLabel
                            name='company_status'
                            control={
                                <Checkbox onChange={handleChange} checked={manufacturer_active_status} />
                            }
                            label="Active"
                        />
                    </FormGroup>
                </div>
            </div>
            <button>Create Manufacturer</button>
        </form>
    );
};

export default EditManufactureAdmin; 
