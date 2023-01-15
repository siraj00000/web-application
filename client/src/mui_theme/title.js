import * as React from 'react';
import { styled } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    fontSize: '25px',
    fontWeight: 'bold'
}));

export default function CustomizeTitle({text}) {
    return <Div>{text}</Div>;
}