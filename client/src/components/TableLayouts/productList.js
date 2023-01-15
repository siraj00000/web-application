import * as React from 'react';
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
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteColloction } from '../../utils/actions/category';

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

export default function ProductTabel({ data, token, toggleLoader }) {
    const [error, setError] = React.useState('');
    let nav = useNavigate();

    // View detail
    const viewhandler = (item) => { nav(`detail`, { state: { data: item } }); };

    // Edit collection 
    const edithandler = (id, item) => {
        if (id) {
            nav(`update`, { state: { data: item, id } });
        }
    };

    // Delete collection
    const deletehandler = (id) => {
        try {
            let url = `/api/delete-product/${id}`;
            const deleteRow = deleteColloction;
            DeleteAlert(deleteRow, url, token)
                .then(res => toggleLoader(res));
        } catch (error) {
            setError(error?.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <>
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <TableContainer sx={{ width: '100%', maxHeight: '500px' }} component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Product Name</StyledTableCell>
                            <StyledTableCell align="center">Company</StyledTableCell>
                            <StyledTableCell align="center">Brand</StyledTableCell>
                            <StyledTableCell align="center">Category</StyledTableCell>
                            <StyledTableCell align="center">View</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                            <StyledTableCell align="center">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <StyledTableRow key={row._id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.product_name}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.company_name}</StyledTableCell>
                                <StyledTableCell align="center">{row.brand_name}</StyledTableCell>
                                <StyledTableCell align="center">{row.category_name}</StyledTableCell>
                                <StyledTableCell align="center" onClick={() => viewhandler(row)}><VisibilityIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                                <StyledTableCell align="center" onClick={() => edithandler(row?._id, row)}><EditIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                                <StyledTableCell align="center" onClick={() => deletehandler(row?._id)}><DeleteForeverIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
