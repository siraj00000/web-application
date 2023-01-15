import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { removeStatus, token } from '../../../../../utils/actions';
import { fetchCategory } from '../../../../../utils/actions/category';
import { SERVER_URL } from '../../../../../utils/constants';
import { downloadCSV } from '../../../../../utils/actions/sub-actions';
import AddIcon from '@mui/icons-material/Add';
import CustomizeTitle from '../../../../../mui_theme/title';
import CategoryTables from '../../../../../components/TableLayouts/categoryList';
import Splash from '../../../../../components/splash';
import Searchbar from '../../../../../components/Searchbar';
import Pagination from '../../../../../components/Pagination';

const Category = () => {
    let nav = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [_categoryList, setCategoryList] = useState([]);
    const [isResponse, setResponse] = useState('');
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const getCategory = async () => {
            setResponse("0");
            let URL = `/api/category?category_name=${search}&page=${page}&limit=50`;
            fetchCategory(token, URL)
                .then(res => {
                    if (!res?.data?.success) {
                        setResponse('Collection is Empty');
                    } else {
                        setResponse('1');
                        setCategoryList(res?.data?.data);
                        setTotalPages(res?.data?.pages);
                    }
                })
                .catch(error => setError(error?.response.data.error));
        };
        getCategory();
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
            let URL = `/api/generate-category-csv?category_name=${search}&page=${page}`;
            downloadCSV(token, URL)
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
        <div style={{ width: '80%' }}>
            {/* <BreadCrumbs /> */}
            <div className='direction-corner'>
                <div className='direction' >
                    {/* Tittle */}
                    <CustomizeTitle text={'Category'} />
                    {isResponse === '1' || (isResponse?.length <= 1 &&
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
                        onClick={() => nav(`create-category`)}
                    >
                        Category
                    </Button>
                </Box>
            </div>
            {/* Error Responser */}
            {error !== '' && <Alert severity="error">{error}</Alert>}

            {/* Responser */}
            {isResponse?.length > 1 && <Alert severity="warning">{isResponse}</Alert>}

            {isResponse?.length <= 1 && _categoryList?.length !== 0 &&
                <CategoryTables data={_categoryList} token={token} toggleLoader={toggleLoader} />
            }

            <Pagination count={totalPages} setPage={setPage} />
        </div>
    );
};

export default Category;