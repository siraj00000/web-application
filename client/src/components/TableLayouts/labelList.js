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
import { deleteColloction } from '../../utils/actions/category';
import { useNavigate } from 'react-router-dom';
import { removeStatus } from '../../utils/actions';

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

export default function LabelTable({ data, token, toggleLoader }) {
    const [error, setError] = React.useState('');
    let nav = useNavigate();

    // View Detail
    const viewHandler = item => {
        nav(`detail`, { state: { data: item } });
    };

    // Delete collection
    const deletehandler = (id) => {
        try {
            let url = `/api/delete-label/${id}`;
            const deleteRow = deleteColloction;
            DeleteAlert(deleteRow, url, token)
                .then(res => toggleLoader(res));
        } catch (error) {
            setError(error?.response.data.error);
            removeStatus(setError);
        }
    };


    return (
        <>
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <TableContainer sx={{ width: '100%', maxHeight: '500px' }} component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell align="center">Manufacturer Name</StyledTableCell>
                            <StyledTableCell align="center">Batch Number</StyledTableCell>
                            <StyledTableCell align="center">Serial Number</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">View</StyledTableCell>
                            <StyledTableCell align="center">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <StyledTableRow key={row._id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.company_name}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.manufacturer_name}</StyledTableCell>
                                <StyledTableCell align="center">{row.batch_number}</StyledTableCell>
                                <StyledTableCell align="center">{row.serial_number}</StyledTableCell>
                                <StyledTableCell align="center">{row.tag_active ? "Active": "Inactive"}</StyledTableCell>
                                <StyledTableCell align="center" onClick={() => viewHandler(row)}><VisibilityIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                                <StyledTableCell align="center" onClick={() => deletehandler(row?._id)}><DeleteForeverIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
