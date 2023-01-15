/**Plan 
 * ? Company Admin's CRUD
 * @table View Company Admins
 * @form Edit Company Admins
 * @form Create Company Admins
 * @func Delete Company Admin
 */

import React, { useState } from 'react';
import { Alert, Box, CircularProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomizeTitle from '../../../../../mui_theme/title';
import TableLayout from '../../../../../components/TableLayouts/companyList';
import '../admin.css';
import { useNavigate } from 'react-router-dom';
import { removeStatus, token } from '../../../../../utils/actions';
import Searchbar from '../../../../../components/Searchbar';
import Pagination from '../../../../../components/Pagination';
import { downloadCSV } from '../../../../../utils/actions/sub-actions';
import { SERVER_URL } from '../../../../../utils/constants';
import { fetchCompany } from '../../../../../utils/actions/companyData';

const CompanyAdmin = ({ isResponse: RES, error: err, toggleLoader }) => {
  let nav = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [companyDetail, setCompanyDetail] = useState([]);
  const [error, setError] = useState(err);
  const [isResponse, setResponse] = useState(RES);

  React.useEffect(() => {
    setResponse("0");
    try {
      // Fetching Company Method
      let companyURL = `/api/fetch-company-admin?company_name=${search}&page=${page}&limit=50`;
      fetchCompany(token, companyURL)
        .then(res => {
          if (!res?.data.success) {
            setResponse('Collection is Empty');
            setCompanyDetail([]);
            setTotalPages(1);
          }
          else {
            setResponse('1');
            setCompanyDetail(res?.data?.data);
            setTotalPages(res?.data?.pages);
          }
        }).catch(err => {
          setError(err);
          removeStatus(setError);
        });
    } catch (error) {
      setError(error.message);
    }
  }, [search, page]);

  const generateCSV = () => {
    try {
      let URL = `/api/generate-company-csv?company_name=${search}&page=${page}`;
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
    <div className='ca_container'>
      {/* Error Alert */}
      {error !== '' && <Alert severity="error">{error}</Alert>}

      <div className='direction-corner'>
        <div className='direction'>
          {/* Tittle */}
          <CustomizeTitle text={'Company'} />
          {isResponse === '1' || (isResponse.length <= 1 &&
            <CircularProgress size={25} sx={{ ml: 1 }} />
          )}
        </div>

        {/* Add company admin */}
        <Box className='direction'>
          <Searchbar handler={searchHandler} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            style={{ ml: "5px" }}
            onClick={generateCSV}
          >
            CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ margin: "0 5px" }}
            onClick={() => nav(`register-company-admin`,)}
          >
            Company Admin
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => nav(`create-company-admin`,)}
          >
            Company
          </Button>
        </Box>
      </div>

      {/* Error Responser */}
      {error !== '' && <Alert severity="error">{error}</Alert>}

      {/* Responser */}
      {isResponse.length > 1 && <Alert severity="warning">{isResponse}</Alert>}

      {/* Table */}
      {companyDetail.length !== 0 &&
        <TableLayout detail={companyDetail} token={token} toggleLoader={toggleLoader} />
      }

      <Pagination count={totalPages} setPage={setPage} />
    </div>
  );
};

export default CompanyAdmin;

