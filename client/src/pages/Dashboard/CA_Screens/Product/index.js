import { Alert, Box, Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeStatus, token } from '../../../../utils/actions';
import { downloadProductCSV } from '../../../../utils/actions/sub-actions';
import Pagination from '../../../../components/Pagination';
import Searchbar from '../../../../components/Searchbar';
import Splash from '../../../../components/splash';
import CustomizeTitle from '../../../../mui_theme/title';
import { SERVER_URL } from '../../../../utils/constants';
import AddIcon from '@mui/icons-material/Add';
import { fetchProducts } from '../../../../utils/actions/Company/com_action';
import ProductTabel from '../../../../components/TableLayouts/productList';

const Product = ({ user }) => {
    let nav = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [isResponse, setResponse] = useState('');
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const getLabel = async () => {
            setResponse("0");
            const formData = new FormData();
            formData.append('email', user.company_email);

            let URL = `/api/fetch-product?product_name=${search}&page=${page}&limit=5`;
            fetchProducts(token, URL, formData)
                .then(res => {
                    if (!res?.data?.success) {
                        setResponse('Collection is Empty');
                    } else {
                        setResponse('1');
                        setProductList(res?.data?.data);
                        setTotalPages(res?.data?.pages);
                    }
                })
                .catch(error => {
                    setError(error);
                    removeStatus(setError);
                });
        };
        getLabel();
    }, [isLoading, search, page]);

    const toggleLoader = sign => setLoading(sign);

    if (isLoading) {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        return <Splash loading={isLoading} />;
    }

    const generateCSV = () => {
        try {
            const formData = new FormData();
            formData.append('email', user.company_email);

            let URL = `/api/generate-product-csv?product_name=${search}&page=${page}`;
            downloadProductCSV(token, URL, formData)
                .then(({ data }) => {
                    if (!data.success) return false;
                    window.open(SERVER_URL + data?.downloadURL, '_parent');
                })
                .catch(error => {
                    setError(error);
                    removeStatus(setError);
                });
        } catch (error) {
            setError(error.message);
        }
    };
    const searchHandler = (value) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div>
            <div className='direction-corner'>
                <div className='direction' >
                    {/* Tittle */}
                    <CustomizeTitle text={'PRODUCTS'} />
                    {isResponse === '1' || (isResponse.length <= 1 &&
                        <CircularProgress size={25} sx={{ ml: 1 }} />
                    )}
                </div>

                {/* Add Categories */}
                <Box className='direction'>
                    <Searchbar handler={searchHandler} />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={generateCSV}
                        sx={{ mr: '5px' }}
                    >
                        CSV
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => nav(`create-product`)}
                    >
                        Product
                    </Button>
                </Box>
            </div>
            {/* Error Responser */}
            {error !== '' && <Alert severity="error">{error}</Alert>}

            {/* Responser */}
            {isResponse?.length > 1 && <Alert severity="warning">{isResponse}</Alert>}

            {productList?.length !== 0 &&
                <ProductTabel data={productList} token={token} toggleLoader={toggleLoader} />
            }

            <Pagination count={totalPages} setPage={setPage} />
        </div>
    );
};

export default Product;