import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';
import { fetchAdmins } from '../../../../../utils/actions/companyData';
import { removeStatus, token } from '../../../../../utils/actions';
import { DeleteAlert } from '../../../../../components/Sweet_Alerts';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Splash from '../../../../../components/splash';
import { deleteColloction } from '../../../../../utils/actions/category';
import ResetPasswordDialogBox from '../../../../../components/ResetUserModal';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function ViewManufacturerAdmin() {
    const [admins, setAdmins] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const { state: { data, type } } = useLocation();

    React.useEffect(() => {
        try {
            const formData = new FormData();
            formData.append("company_email", data?.manufacturer_email);
            fetchAdmins(token, formData)
                .then(res => {
                    setAdmins(res.data?.data);
                }).catch(error => {
                    setError(error);
                    removeStatus(setError);
                });
        } catch (error) {
            setError(error.message);
            removeStatus(setError);
        }
    }, [isLoading]);

    const deleteHandler = (id, role) => {
        try {
            let url = `/api/auth/remove-user/${id}/${role}`;
            const deleteRow = deleteColloction;
            DeleteAlert(deleteRow, url, token)
                .then(res => setLoading(res));
        } catch (error) {
            setError(error);
        }
    };


    if (isLoading) {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        return <Splash loading={isLoading} />;
    }

    return (
        <>
            {error !== '' && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TableContainer sx={{ width: '80%' }} component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>{type} Admin</StyledTableCell>
                            <StyledTableCell align="center">Details</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(data).length !== 0 &&
                            Object.entries(data).map(([key, value]) => {
                                let dateTypeKey = key === 'estaiblishment_year' || key === 'createdAt' || key === 'updatedAt';
                                const year = dateTypeKey && value.split("T")[0];
                                let status = (key === 'company_active_status' || key === 'manufacturer_active_status') && (value ? "Active" : 'In Active');
                                let sub_category = key === 'sub_category' && Object.values(value).join(', ');

                                return (
                                    <React.Fragment key={key + value}>
                                        {
                                            (key !== 'company_id') && (key !== '_id') && (key !== "__v") &&
                                            <StyledTableRow>
                                                <StyledTableCell align="left">{key}</StyledTableCell>
                                                <StyledTableCell align="center">{sub_category || year || status || value}</StyledTableCell>
                                            </StyledTableRow>
                                        }
                                    </React.Fragment>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            {admins?.length !== 0 &&
                <TableContainer sx={{ width: '80%', mt: 5 }} component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ width: '45%' }}>Admin</StyledTableCell>
                                <StyledTableCell sx={{ width: '45%' }} align="center">Details</StyledTableCell>
                                <StyledTableCell align="center">Delete</StyledTableCell>
                                <StyledTableCell align="center">Edit</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins?.map((item) => {
                                return (
                                    <StyledTableRow key={item?._id}>
                                        <StyledTableCell sx={{ width: '45%' }} align="left">Email</StyledTableCell>
                                        <StyledTableCell sx={{ width: '45%' }} align="center">{item.email}</StyledTableCell>
                                        <StyledTableCell
                                            align="center" onClick={() => deleteHandler(item?._id, item?.role)}>
                                            <DeleteForeverIcon sx={{ cursor: 'pointer' }} />
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <ResetPasswordDialogBox email={item.email} />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </>
    );
}
