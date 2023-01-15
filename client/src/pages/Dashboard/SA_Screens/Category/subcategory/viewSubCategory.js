import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useLocation } from 'react-router-dom';

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

export default function ViewSubCategory() {
    const { state } = useLocation();
    let { detail } = state;
    return (
        <TableContainer sx={{ width: '80%' }} component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Sub-Category</StyledTableCell>
                        <StyledTableCell align="center">Details</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(detail).map(([key, value]) => {
                        let dateTypeKey = key === 'createdAt' || key === 'updatedAt';
                        const year = dateTypeKey && value.split("T")[0];
                        let status = key === 'sub_category_active_status' && (value ? "Active" : 'In Active');
                        let _feature = key === 'feature' && Object.values(value).join(', ');
                        return (
                            <>
                                {
                                    (key !== 'parent_category_id') && (key !== '_id') && (key !== "__v") &&
                                    <StyledTableRow key={key + value}>
                                        <StyledTableCell align="left">{key}</StyledTableCell>
                                        <StyledTableCell align="center">{_feature || year || status || value}</StyledTableCell>
                                    </StyledTableRow>
                                }
                            </>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
