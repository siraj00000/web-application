import React, { useState } from 'react';
import { removeStatus, token } from '../../../../utils/actions';
import { fetchBrandByEmail, fetchSubCategory, fetchSubCtgByCtg } from '../../../../utils/actions/Manufacturer/maf_action';
import '../../../auth/auth.css';
import '../../SA_Screens/Brand/brand.css';
import '../../SA_Screens/Admin/admin.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomizeTitle from '../../../../mui_theme/title';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const CreateProduct = ({ user }) => {
    const nav = useNavigate();
    const [productName, setProductName] = useState("");
    const [brand, setBrand] = useState();
    const [brandList, setBrandList] = useState([]);
    const [category, setCategory] = useState([]);
    const [categoryId, setCategoryId] = useState();
    const [subCategory, setsubCategory] = useState([]);
    const [subCategoryId, setSubCategoryId] = useState("");
    const [variantType, setVariantType] = useState("");
    const [variantList, setVariantList] = useState([]);
    const [variants, setVariants] = useState([]);
    const [reqHelp, setReqHelp] = useState(false);
    const [subCatFeatures, setsubCatFeatures] = useState([]);

    // States for status 
    const [error, setError] = useState('');

    React.useEffect(() => {
        const fetchData = () => {
            // For brands
            const formData = new FormData();
            formData.append('email', user.company_email);

            fetchBrandByEmail(token, `/api/fetch-brand-by-email`, formData)
                .then(res => {
                    if (res.data.data.length === 0) return setError("404");
                    setBrandList(res.data?.data);
                })
                .catch(error => {
                    setError(error);
                    removeStatus(setError);
                });

            // For Category
            let catURL = `/api/category`;
            fetchSubCtgByCtg(token, catURL)
                .then(res => setCategory(res?.data?.data))
                .catch(error => {
                    setError(error);
                    removeStatus(setError);
                });
        };
        fetchData();
    }, []);

    // Brand selection from dropdown
    // Looping brandList just to fix this type [object]
    const selectBrand = id => {
        brandList?.forEach(element => {
            if (element._id === id) {
                setBrand(element);
                setReqHelp(element?.request_help);
            }
        });
    };

    // selecting category and fetching related subcategories
    const selectCategoryAndFetchData = async data => {
        try {
            let id = data.split(" ")[0];
            setCategoryId(id);

            // Fetching Subcategory where category id matches
            let subURL = `/api/fetch-subcategory/${id}`;
            const response = await fetchSubCategory(token, subURL);
            setsubCategory(response.data.data);
        } catch (error) {
            setError(error);
            removeStatus(setError);
        }
    };

    const selectSubCategory = data => {
        if (data === '') return false;
        let id = data.split(" ")[0];
        let feature = data.split(" ")[1].split(",");

        setSubCategoryId(id);
        setsubCatFeatures(feature);
    };

    const addVariantHandler = () => {
        let list = [...variantList];
        let value = variants.concat(variantType);
        list.push(value);
        setVariantList(list);
        setVariants("");
    };

    const handleRemove = (index) => {
        let list = [...variantList];
        list.splice(index, 1);
        setVariantList(list);
    };

    const handleProductFormSubmit = e => {
        e.preventDefault();
        if (!subCategoryId) return swal("Undefined!", "Sub-Category does not found!", "error");
        const data = {
            productName,
            brand,
            categoryId,
            subCategoryId,
            variantList,
            variantType,
            reqHelp,
            company_email: user.company_email,
            sub_category_feature: subCatFeatures
        };
        nav("/ls-admin/products/CreateProduct", { state: { data } });
    };

    if (error === '404') return <Alert severity="warning">No brand data found !!</Alert>;

    return (
        <form className='form-sec width-100per' onSubmit={handleProductFormSubmit} >
            <CustomizeTitle text={'Create Product'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form'>
                <section className='width-80per direction-corner wrap-container'>
                    <div className='company_admin_form_field'>
                        <label>Product Name</label>
                        <input placeholder='ABC...' value={productName} onChange={e => setProductName(e.target.value)} required />
                    </div>
                    {/* BRANDS */}
                    <div className='company_admin_form_field'>
                        <label>Brands</label>
                        <select onChange={(e) => selectBrand(e.target.value)} required>
                            <option value="">select brand</option>
                            {brandList?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={item._id}
                                        className='company_list'>
                                        {item.brand}
                                    </option>
                                );
                            })}
                        </select>
                        <FilterListIcon className='filter-icon' />
                    </div>
                    {/* CATEGORY */}
                    <div className='company_admin_form_field'>
                        <label>Category</label>
                        <select onChange={(e) => selectCategoryAndFetchData(e.target.value)} required>
                            <option value="">select category</option>
                            {category?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={item._id + " " + item.category_name}
                                        className='company_list'>
                                        {item.category_name}
                                    </option>
                                );
                            })}
                        </select>
                        <FilterListIcon className='filter-icon' />
                    </div>
                    {/* SUB CATEGORY */}
                    {subCategory.length !== 0 && <div className='company_admin_form_field'>
                        <label>Sub Category</label>
                        <select onChange={(e) => selectSubCategory(e.target.value)} required>
                            <option value="">select sub-category</option>
                            {subCategory?.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={item._id + " " + item.feature}
                                        className='company_list'>
                                        {item.sub_category}
                                    </option>
                                );
                            })}
                        </select>
                        <FilterListIcon className='filter-icon' />
                    </div>}
                    {/* VARIANT */}
                    <div className='company_admin_form_field'>
                        <label>Variant</label>
                        <input placeholder='KG, Ltr...' value={variantType} onChange={e => setVariantType(e.target.value)} required />
                    </div>
                    {/* VARIANT TYPE */}
                    <div className='company_admin_form_field'>
                        <label>Variant type</label>
                        <input placeholder='variants...' className='right-spacing' value={variants} onChange={e => setVariants(e.target.value)} />
                        <AddIcon className='addlist__icon'
                            onClick={addVariantHandler}
                        />
                    </div>
                </section>
                <section className='width-20per'>
                    {variantList.length !== 0 &&
                        <div style={{ margin: "15px 0" }}>
                            <label>Variants</label>
                            <div className='chips'>
                                {variantList?.map((item, index) => {
                                    return (
                                        <p
                                            key={index}
                                            onClick={() => handleRemove(index)}
                                            className='sub-category-chips selected-chip'
                                        >{item} <CloseIcon /></p>
                                    );
                                })}
                            </div>
                        </div>
                    }
                </section>
            </div>
            <button className='width-80per margin-0per'>Next</button>
        </form>
    );
};

export default CreateProduct;