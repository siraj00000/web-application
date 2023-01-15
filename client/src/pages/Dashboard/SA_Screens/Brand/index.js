import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { fetchBrands } from '../../../../utils/actions/brand';
import { removeStatus, token } from '../../../../utils/actions';
import CustomizeTitle from '../../../../mui_theme/title';
import AddIcon from '@mui/icons-material/Add';
import BrandsTables from '../../../../components/TableLayouts/brandList';
import Splash from '../../../../components/splash';
import Searchbar from '../../../../components/Searchbar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { downloadCSV } from '../../../../utils/actions/sub-actions';
import { SERVER_URL } from '../../../../utils/constants';
import Pagination from '../../../../components/Pagination';

const Brands = () => {
    let nav = useNavigate();
    const [isLoading, setLoading] = React.useState(false);
    const [brandsList, setBrands] = useState([]);
    const [isResponse, setResponse] = useState('');
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const getBrands = async () => {
            setResponse("0");
            let URL = `/api/fetch-brands?brand=${search}&page=${page}&limit=50`;
            fetchBrands(token, URL)
                .then(res => {
                    if (!res?.data?.success) {
                        setResponse('Collection is Empty');
                    } else {
                        setResponse('1');
                        setBrands(res?.data?.data);
                        setTotalPages(res?.data?.pages);
                    }
                })
                .catch(error => setError(error?.response.data.error));
        };
        getBrands();
    }, [isLoading, search, page]);

    const toggleLoader = sign => setLoading(sign);

    if (isLoading) {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        return <Splash loading={isLoading} />;
    }

    const generateCSV = async () => {
        try {
            let url = `/api/generate-brand-csv?brand=${search}&page=${page}`;
            downloadCSV(token, url)
                .then(({ data }) => {
                    if(!data.success) return false
                    window.open(SERVER_URL + data.downloadURL, '_parent');
                }).catch(error => {
                    setError(error);
                    removeStatus(setError);
                });
        } catch (error) {
            setError(error);
            removeStatus(setError);
        }
    };
    const searchHandler = (value) => {
        setSearch(value);
        setPage(1);
    };
    return (
        <div style={{ width: '100%' }}>
            <div className='direction-corner'>
                <div className='direction' onClick={() => setPage(page + 1)}>
                    {/* Tittle */}
                    <CustomizeTitle text={'Brands'} />
                    {isResponse === '1' || (isResponse.length <= 1 &&
                        <CircularProgress size={25} sx={{ ml: 1 }} />
                    )}
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
                        onClick={() => nav(`create-brand`)}
                    >
                        Brand
                    </Button>
                </Box>
            </div>
            {/* Error Responser */}
            {error !== '' && <Alert severity="error">{error}</Alert>}

            {/* Responser */}
            {isResponse?.length > 1 && <Alert severity="warning">{isResponse}</Alert>}

            {brandsList?.length !== 0 &&
                <BrandsTables data={brandsList} token={token} toggleLoader={toggleLoader} />
            }

            <Pagination count={totalPages} setPage={setPage} page={page} />
        </div>
    );
};

export default Brands;