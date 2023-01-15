import React from 'react';
import { Pagination as CollectionPagination } from '@mui/material';

const Pagination = ({ count, setPage, page }) => {
    const handleChange = (event, value) => {
        setPage(value);
    };
    return (
        <CollectionPagination
            className='margin-vertical'
            count={count}
            shape="rounded"
            color="primary"
            onChange={handleChange}
            page={page}
        />
    );
};

export default Pagination;