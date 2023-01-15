import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import API from '../../../../../API';
import '../../../../auth/auth.css';
import '../../Admin/admin.css';
import CustomizeTitle from '../../../../../mui_theme/title';
import { removeStatus, token } from '../../../../../utils/actions';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Splash from '../../../../../components/splash';

const CreateCategory = () => {
    let nav = useNavigate();
    // Field States
    const [isLoading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const insertCompanyAdmin = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        };

        try {
            setLoading(true);
            const response = await API.post("api/insert-category", {
                category_name: category
            }, config);

            swal({
                title: "Success!",
                text: response?.data?.msg,
                icon: "success",
                button: "Okay!",
            }).then(() => {
                nav('/ls-admin/category', { replace: true });
                setLoading(false);
            });

        } catch (error) {
            setLoading(false);
            setError(error?.response.data.error);
            removeStatus(setError);
        } finally {
            setCategory('');
        }
    };
    if (isLoading) return <Splash loading={isLoading} />;
    return (
        <form className='form-sec half-width' onSubmit={insertCompanyAdmin}>
            <CustomizeTitle text={'Add Category'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form '>
                <div className='company_admin_form_field full_width_cont'>
                    <label>Category</label>
                    <input placeholder='Electronics...' value={category} onChange={e => setCategory(e.target.value)} required />
                </div>
            </div>
            <button>Create Category</button>
        </form>
    );
};

export default CreateCategory;