import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DeleteAlert } from '../Sweet_Alerts';
import { useNavigate } from 'react-router-dom';
import { deleteColloction } from '../../utils/actions/category';
import { Alert } from '@mui/material';

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

export default function ManufacturerList({ detail, token, toggleLoader }) {
    const [error, setError] = React.useState('');

    let nav = useNavigate();

    // View Detail
    const viewHandler = item => {
        nav(`manufacturer-detail`, { state: { data: item, type: 'Manufacturer' } });
    };

    // Edit collection 
    const editHandler = (id, item) => {
        if (id) {
            nav(`edit-manufacturer`, { state: { data: item, id } });
        }
    };

    // Delete collection
    const deleteHandler = (id, email) => {
        try {
            let url = `/api/delete-manufacturer-admin/${id}`;
            const deleteRow = deleteColloction;
            DeleteAlert(deleteRow, url, token, email)
                .then(res => toggleLoader(res));
        } catch (error) {
            setError(error);
        }
    };

    return (
        <>
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">manufacturer</StyledTableCell>
                            <StyledTableCell align="center">company_email</StyledTableCell>
                            <StyledTableCell align="center">company</StyledTableCell>
                            <StyledTableCell align="center">pincode</StyledTableCell>
                            <StyledTableCell align="center">View</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                            <StyledTableCell align="center">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {detail?.map((row) => {
                            return (
                                <StyledTableRow key={row._id}>
                                    <StyledTableCell align="center">{row.manufacturer}</StyledTableCell>
                                    <StyledTableCell align="center">{row.manufacturer_email}</StyledTableCell>
                                    <StyledTableCell align="center">{row.company_name}</StyledTableCell>
                                    <StyledTableCell align="center">{row.pincode}</StyledTableCell>
                                    <StyledTableCell align="center" onClick={() => viewHandler(row)}><VisibilityIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                                    <StyledTableCell align="center" onClick={() => editHandler(row?._id, row)}><EditIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                                    <StyledTableCell align="center" onClick={() => deleteHandler(row?._id, row.manufacturer_email)}><DeleteForeverIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
