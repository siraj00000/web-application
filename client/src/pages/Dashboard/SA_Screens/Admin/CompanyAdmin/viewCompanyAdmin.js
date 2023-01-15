import * as React from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useLocation } from 'react-router-dom';
import { fetchAdmins } from '../../../../../utils/actions/companyData';
import { removeStatus, token } from '../../../../../utils/actions';
import { Alert } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Splash from '../../../../../components/splash';
import { DeleteAlert } from '../../../../../components/Sweet_Alerts';
import { deleteColloction } from '../../../../../utils/actions/category';
import swal from 'sweetalert';
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

export default function ViewCompanyAdmin() {
    const [admins, setAdmins] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const { state } = useLocation();
    let { data, type } = state;

    React.useEffect(() => {
        try {
            if (data.company_email === '') {
                swal('Invalid company!');
                return false;
            }
            const formData = new FormData();
            formData.append("company_email", data.company_email);
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
                            <StyledTableCell>{type}</StyledTableCell>
                            <StyledTableCell align="center">Details</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(data).map(([key, value]) => {
                            let dateTypeKey = key === 'estaiblishment_year' || key === 'createdAt' || key === 'updatedAt';
                            const year = dateTypeKey && value.split("T")[0];
                            let status = (key === 'company_active_status' || key === 'manufacturer_active_status') && (value ? "Active" : 'In Active');
                            return (
                                <React.Fragment key={key + value}>
                                    {
                                        (key !== 'company_id') && (key !== 'sub_category') && (key !== '_id') && (key !== "__v") &&
                                        <StyledTableRow>
                                            <StyledTableCell align="left">{key}</StyledTableCell>
                                            <StyledTableCell align="center">{year || status || value}</StyledTableCell>
                                        </StyledTableRow>
                                    }
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {data?.sub_category.length !== 0 &&
                <TableContainer sx={{ width: '80%', mt: 5 }} component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Sub-Category</StyledTableCell>
                                <StyledTableCell align="center">Details</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.sub_category.map((item, index) => {
                                // console.log(key);
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell align="left">sub_category</StyledTableCell>
                                        <StyledTableCell align="center">{item.sub_category}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {admins.length !== 0 &&
                <TableContainer sx={{ width: '80%', mt: 5 }} component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ width: '45%' }}>{type} Admin</StyledTableCell>
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
