import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import '../../../../auth/auth.css';
import '../../Admin/admin.css';

import CustomizeTitle from '../../../../../mui_theme/title';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { updateSubCategory } from '../../../../../utils/actions/category';
import { useLocation, useNavigate } from 'react-router-dom';
import { removeStatus, token } from '../../../../../utils/actions';
import swal from 'sweetalert';
import Splash from '../../../../../components/splash';

const EditSubCategory = () => {
    let { state } = useLocation();
    let { detail, id } = state;

    let nav = useNavigate();
    // Field States
    const [isLoading, setLoading] = useState(false);
    const [sub_category_active_status, setSubCategoryActiveStatus] = useState(detail.sub_category_active_status);
    const [error, setError] = useState('');

    const insertCompanyAdmin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let url = `api/update-subcategory/${id}`;
            let reqBody = { sub_category_active_status, parent_category_id: detail?.parent_category_id };
            updateSubCategory(url, token, reqBody)
                .then(res => {
                    swal({
                        title: "Success!",
                        text: res?.data?.msg,
                        icon: "success",
                        button: "Okay!",
                    }).then(() => {
                        nav('/ls-admin/subcategory', { replace: true });
                        setLoading(false);
                    });
                })
                .catch(error => {
                    setError(error?.response.data.error);
                    removeStatus(setError);
                    setLoading(false);
                });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (event) => {
        setSubCategoryActiveStatus(event.target.checked);
    };

    if (isLoading) return <Splash loading={isLoading} />;

    return (
        <form className='form-sec' onSubmit={insertCompanyAdmin}>
            <CustomizeTitle text={'Update Sub-Category'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form '>
                <div className='company_admin_form_field'>
                    <label>Category Status</label>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControlLabel
                            name='company_status'
                            control={
                                <Checkbox onChange={handleChange} checked={sub_category_active_status} />
                            }
                            label="Active"
                        />
                    </FormGroup>
                </div>
            </div>
            <button>Update Sub-Category</button>
        </form>
    );
};

export default EditSubCategory;