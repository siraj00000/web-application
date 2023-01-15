import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { fetchCategory, fetchSubCategory } from '../../../../../utils/actions/category';
import { removeStatus, token } from '../../../../../utils/actions';
import CustomizeTitle from '../../../../../mui_theme/title';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SubCategoryTables from '../../../../../components/TableLayouts/subcategoryList';
import Splash from '../../../../../components/splash';
import Searchbar from '../../../../../components/Searchbar';
import { downloadCSV } from '../../../../../utils/actions/sub-actions';
import { SERVER_URL } from '../../../../../utils/constants';
import Pagination from '../../../../../components/Pagination';

const SubCategory = () => {
    let nav = useNavigate();
    const [_subCategoryList, setSubCategoryList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [warning, setWarning] = useState();
    const [error, setError] = useState('');
    const [hasData, setHasData] = React.useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
   
    useEffect(() => {
        fetchCategory(token, `/api/category`)
            .then(resp => {
                if (!resp.data?.success) return setHasData(false);
                setCategory(resp.data.data);
                // Fetch sub-category if category exists 
                const fetchSubCategoryData = async () => {
                    try {
                        let URL = `/api/fetch-subcategory?sub_category=${search}&page=${page}&limit=50`;
                        fetchSubCategory(token, URL)
                            .then(res => {
                                let response = res?.data;
                                if (!response?.success) {
                                    setWarning('Collection is Empty');
                                    setSubCategoryList([]);
                                    setTotalPages(1);
                                }
                                else {
                                    setWarning(false);
                                    setSubCategoryList(response?.data);
                                    setTotalPages(response?.pages);
                                }
                            }).catch(error => {
                                setError(error);
                                removeStatus(setError);
                            });

                    } catch (error) {
                        setError(error?.response.data.error);
                    }
                };
                fetchSubCategoryData();
            })
            .catch(err => { setError(err); removeStatus(setError); });
    }, [isLoading, search, page]);

    const toggleLoader = sign => setLoading(sign);

    if (isLoading) {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        return <Splash loading={isLoading} />;
    }

    if (!hasData) return <Alert severity='warning'>Make sure you have categories.</Alert>;

    const generateCSV = () => {
        try {
            let URL = `/api/generate-csv-subcat?sub_category=${search}&page=${page}`;
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

    const isWarning = Boolean(warning !== undefined && typeof warning === 'string');

    return (
        <div style={{ width: '80%' }}>
            <div className='direction-corner'>
                <div className='direction'>
                    {/* Tittle */}
                    <CustomizeTitle text={'Sub Category'} />
                    {!isWarning && !_subCategoryList.length &&
                        <CircularProgress size={25} sx={{ ml: 1 }} />
                    }
                </div>

                {/* Add company admin */}
                <Box className='direction'>
                    <Searchbar handler={searchHandler} />
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={generateCSV}
                        sx={{ mr: '5px' }}
                    >
                        CSV
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => nav(`create-subcategory`)}
                    >
                        Sub Category
                    </Button>
                </Box>
            </div>
            {/* Error Responser */}
            {error !== '' && <Alert severity="error">{error}</Alert>}

            {/* Responser */}
            {isWarning && <Alert severity="warning">{warning}</Alert>}

            {!isWarning && _subCategoryList.length !== 0 &&
                <SubCategoryTables data={_subCategoryList} token={token} category={category} toggleLoader={toggleLoader} />
            }

            <Pagination count={totalPages} setPage={setPage} />
        </div>
    );
};

export default SubCategory;