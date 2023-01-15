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

export default function LabelDetail() {
    const { state } = useLocation();
    let { data } = state;
    console.log(data);
    return (
        <TableContainer sx={{ width: '80%' }} component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Label</StyledTableCell>
                        <StyledTableCell align="center">Details</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(data).map(([key, value]) => {
                        let dateTypeKey = key === 'createdAt' || key === 'updatedAt';
                        const year = dateTypeKey && value.split("T")[0] + value.split("T")[1];
                        let status = key === 'tag_active' && (value ? "Active" : 'In Active');
                        let URLKey = (key === 'DS1' || key === 'DS2' || key === 'shortDS1' || key === 'shortDS2') && Object.values(value).join(',\n');

                        return (
                            <React.Fragment key={key + value}>
                                {
                                    (key !== 'manufacture_id') &&
                                    (key !== 'brand_id') &&
                                    (key !== 'product_id') &&
                                    (key !== '_id') && (key !== "__v") &&
                                    <StyledTableRow >
                                        <StyledTableCell align="left">{key}</StyledTableCell>
                                        <StyledTableCell align="center">{URLKey || year || status || value}</StyledTableCell>
                                    </StyledTableRow>
                                }
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
