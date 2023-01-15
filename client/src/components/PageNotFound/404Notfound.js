import React from 'react';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import './notfound.css';
import { Button } from '@mui/material';
const PageNotFound = () => {
  let nav = useNavigate();
  return (
    <div className='notfound'>
      <h1>404 Page not found</h1>
      <p> You’re either misspelling the URL or requesting a page that's no longer here.</p>
      <Button
        variant="outlined"
        startIcon={<KeyboardBackspaceIcon />}
        onClick={() => nav(-1)}
      >Back to previous page</Button>
    </div>
  );
};

export default PageNotFound;