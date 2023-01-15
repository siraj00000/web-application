import { Button } from '@mui/material';
import React from 'react';

export const AppButton = ({ Text, Method, Icon }) => {
    return (
        <Button
            variant='contain'
            startIcon={<Icon />}
            onClick={Method}
            sx={{
                marginTop: 2
            }}
        >{Text}</Button>
    );
};