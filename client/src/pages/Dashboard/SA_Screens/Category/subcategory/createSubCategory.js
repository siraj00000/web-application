import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import API from '../../../../../API';
import '../../../../auth/auth.css';
import '../../Admin/admin.css';

import CustomizeTitle from '../../../../../mui_theme/title';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { fetchCategory } from '../../../../../utils/actions/category';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { removeStatus, token } from '../../../../../utils/actions';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Splash from '../../../../../components/splash';

const CreateSubCategory = () => {
    let nav = useNavigate();
    // Field States
    const [isLoading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [sub_category, setSubCategory] = useState('');
    const [feature, setFeature] = useState('');
    const [featureList, setFeatureList] = useState([]);
    const [sub_category_active_status, setSubCategoryActiveStatus] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let URL = `/api/category`;
        fetchCategory(token, URL)
            .then(res => {
                setCategory(res?.data?.data);
            })
            .catch(error => setError(error?.response.data.error));
    }, []);

    const insertCompanyAdmin = async (e) => {
        e.preventDefault();

        if (selectedCategory.length === 0) return setError("Must select parent category");

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        };

        try {
            setLoading(true);
            const response = await API.post("api/insert-subcategory", {
                parent_category_id: selectedCategory[0]._id,
                sub_category,
                sub_category_active_status,
                feature: featureList
            }, config);

            swal({
                title: "Success!",
                text: response?.data?.msg,
                icon: "success",
                button: "Okay!",
            }).then(() => {
                nav('/ls-admin/subcategory', { replace: true });
                setLoading(false);
            });
            
        } catch (error) {
            setLoading(false);
            setError(error?.response.data.error);
            removeStatus(setError);
        }
    };

    const handleChange = (event) => {
        setSubCategoryActiveStatus(event.target.checked);
    };

    const addFeature = () => {
        if (!feature) return false;
        let _list = [...featureList];
        _list.push(feature);
        setFeatureList(_list);
        setFeature("");
    };

    const removeFeature = (index) => {
        let _list = [...featureList];
        _list.splice(index, 1);
        setFeatureList(_list);
    };

    const selectParentCategory = (ctg, index) => {
        let _list = [...selectedCategory];
        _list.push(ctg);
        setSelectedCategory(_list);

        let _category = [...category];
        _category.splice(index, 1);
        setCategory(_category);
    };

    const removeCategory = (ctg, index) => {
        let _category = [...category];
        _category.push(ctg);
        setCategory(_category);

        let _list = [...selectedCategory];
        _list.splice(index, 1);
        setSelectedCategory(_list);
    };

    if (isLoading) return <Splash loading={isLoading} />;

    return (
        <form className='form-sec' onSubmit={insertCompanyAdmin}>
            <CustomizeTitle text={'Add Sub-Category'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form '>
                <div className='company_admin_form_field '>
                    <label>Sub-Category</label>
                    <input placeholder='Electronics...' value={sub_category} onChange={e => setSubCategory(e.target.value)} required />
                </div>
                <div className='company_admin_form_field '>
                    <label>Feature</label>
                    <input placeholder='Automatic...' value={feature} onChange={e => setFeature(e.target.value)} />
                    <AddIcon className='addlist__icon' onClick={addFeature} />
                </div>
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
            {selectedCategory?.length !== 0 &&
                <div>
                    <label>Category</label>
                    <div className='sub-catory-list_not_seleted'>
                        {selectedCategory?.map((item, index) => {
                            return (
                                <p
                                    key={index}
                                    onClick={() => removeCategory(item, index)}
                                    className='sub-category-chips _selected'
                                >{item.category_name} <CloseIcon /></p>
                            );
                        })}
                    </div>
                </div>
            }
            {selectedCategory.length === 0 && category?.length !== 0 &&
                <div>
                    <label>Categories To choose</label>
                    <div className='sub-catory-list_not_seleted'>
                        {category?.map((item, index) => {
                            return (
                                <p
                                    key={index}
                                    onClick={() => selectParentCategory(item, index)}
                                    className='sub-category-chips'
                                >{item.category_name} <AddIcon /></p>
                            );
                        })}
                    </div>
                </div>
            }
            {featureList.length !== 0 &&
                <div>
                    <label>Features</label>
                    <div className='sub-catory-list_not_seleted'>
                        {featureList?.map((item, index) => {
                            return (
                                <p
                                    key={index}
                                    onClick={() => removeFeature(index)}
                                    className='sub-category-chips _selected'
                                >{item} <CloseIcon /></p>
                            );
                        })}
                    </div>
                </div>
            }
            <button>Create Sub-Category</button>
        </form>
    );
};

export default CreateSubCategory;