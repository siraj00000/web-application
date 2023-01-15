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
import VideoPlayer from '../../../../components/VideoPlayer';
import '../../SA_Screens/Brand/brand.css';

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

const ProductDetail = () => {
    const { state: { data } } = useLocation();
    return (
        <>
            <section className='brandDetai__video_and_images'>
                {Object.keys(data?.video_url).length !== 0 &&
                    <div>
                        <h3>Video</h3>
                        {data.video_url?.public_id !== '' ?
                            <VideoPlayer source={data?.video_url?.url} />
                            :
                            <div className='brandDetail__video_container'>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={data?.video_url?.url}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe>
                            </div>
                        }
                    </div>
                }
                <div style={{ marginBottom: 15 }}>
                    <h3>Images</h3>
                    <div className='brandDetail__imageList'>
                        {data?.image_list?.map((item) => {
                            return <img key={item.public_id} src={item.url} className={'brandDetail__img'} alt={'brand_images'} />;
                        })}
                    </div>
                </div>
            </section>
            <TableContainer sx={{ width: '80%' }} component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Product</StyledTableCell>
                            <StyledTableCell align="center">Details</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(data).map(([key, value]) => {
                            let dateTypeKey = key === 'createdAt' || key === 'updatedAt';
                            const year = dateTypeKey && value.split("T")[0] + " " + value.split("T")[1].split('.')[0];
                            let title = (key === 'carousel_headings' || key === "carousel_text")
                                && Object.values(value).join(', ');
                            let isChecked = (typeof value === 'boolean') && (value === true ? "Yes" : "No");
                            return (
                                <React.Fragment key={key + value}>
                                    {
                                        (key !== 'company') &&
                                        (key !== 'brand') &&
                                        (key !== "category") &&
                                        (key !== "sub_category") &&
                                        (key !== "feature") &&
                                        (key !== "image_list") &&
                                        (key !== "video_url") &&
                                        (key !== '_id') && (key !== "__v") &&
                                        <StyledTableRow>
                                            <StyledTableCell align="left">{key}</StyledTableCell>
                                            <StyledTableCell align="center">{isChecked || title || year || value}</StyledTableCell>
                                        </StyledTableRow>
                                    }
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ width: '80%', mt: "2%" }} component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Feature keys</StyledTableCell>
                            <StyledTableCell align="center">Values</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(data?.feature).map(([key, value]) => {

                            return (
                                <React.Fragment key={key + value}>

                                    <StyledTableRow>
                                        <StyledTableCell align="left">{key}</StyledTableCell>
                                        <StyledTableCell align="center">{value}</StyledTableCell>
                                    </StyledTableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ProductDetail;