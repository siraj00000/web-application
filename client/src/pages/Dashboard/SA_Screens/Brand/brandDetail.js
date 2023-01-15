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
import VideoPlayer from '../../../../components/VideoPlayer';
import './brand.css';
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

export default function BrandDetail() {
    const { state } = useLocation();
    let { data, type } = state;
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
                        {data?.image_list?.map((item, index) => {
                            return <img key={index} src={item.url} className={'brandDetail__img'} alt={'brand_images'} />;
                        })}
                    </div>
                </div>
            </section>
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
                            let status = (key === "brand_active_status") && (value ? "Active" : 'In Active');
                            let title = (key === 'carousel_headings' || key === "carousel_text") && Object.values(value).join(', ');
                            let isChecked = (key !== "brand_active_status") && (typeof value === 'boolean') && (value === true ? "Yes" : "No");

                            return (
                                <React.Fragment key={key + value}>
                                    {
                                        (key !== 'company_id') &&
                                        (key !== "image_list") &&
                                        (key !== "video_url") &&
                                        (key !== '_id') && (key !== "__v") &&
                                        <StyledTableRow>
                                            <StyledTableCell align="left">{key}</StyledTableCell>
                                            <StyledTableCell align="center">{isChecked || title || year || status || value}</StyledTableCell>
                                        </StyledTableRow>
                                    }
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

