/**Road Map
 * Render table according to the type of admin
 * 
 * Network
 * this screen help to connect other screen
 * only company admin crud screen and manufacture crud screen
 * */

import { Alert, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Splash from '../../../../components/splash';
import { token } from '../../../../utils/actions';
import { fetchCategory } from '../../../../utils/actions/category';
import { fetchCompany } from '../../../../utils/actions/companyData';
import CompanyAdmin from './CompanyAdmin';
import ManufacturerAdmin from './ManufacturerAdmin';
const AdminList = () => {
    const [isLoading, setLoading] = React.useState(false);
    const [isCompanyAdmin, setCompanyAdmin] = useState(true);
    const [hasData, setHasData] = useState(true);
    const [companyDetail, setCompanyDetail] = useState([]);
    const [isResponse, setResponse] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetching Category Method
        fetchCategory(token, `/api/category`)
            .then(resc => {
                // verify category list isn't empty 
                if (!resc.data.success) return setHasData(false);

                // Fetching Company Method
                fetchCompany(token, `/api/fetch-company-admin`)
                    .then(res => {
                        if (res?.data?.data?.length === 0) {
                            setResponse('Collection is Empty');
                        } else {
                            setResponse('1');
                            setCompanyDetail(res?.data?.data);
                        }
                    }).catch(err => {
                        setError(err);
                        setTimeout(() => {
                            setError("");
                        }, 5000);
                    });
            })
            .catch(err => setError(err));
    }, [isLoading]);


    const toggleLoader = sign => setLoading(sign);

    if (isLoading) {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        return <Splash loading={isLoading} />;
    }

    if (!hasData) return <Alert severity='warning'>Make sure you have categories.</Alert>;

    return (
        <div>
            <Button
                sx={{ marginRight: 2 }}
                variant={isCompanyAdmin ? "contained" : "outlined"}
                onClick={() => setCompanyAdmin(true)}
            >Company</Button>
            <Button
                variant={!isCompanyAdmin ? "contained" : "outlined"}
                onClick={() => setCompanyAdmin(false)}
            >Manufacturer</Button>
            {isCompanyAdmin && <CompanyAdmin
                isResponse={isResponse}
                error={error}
                toggleLoader={toggleLoader}
            />}
            {!isCompanyAdmin && <ManufacturerAdmin
                companyDetail={companyDetail}
                toggleLoader={toggleLoader}
            />}
        </div >
    );
};

export default AdminList;