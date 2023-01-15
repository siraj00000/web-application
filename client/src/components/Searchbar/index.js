import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import './searchbar.css';
const Searchbar = ({ handler, searchBy, setFilterBy }) => {
    return (
        <div className='barCont'>
            {searchBy?.length ?
                <FilterableSearchbar list={searchBy} setFilterBy={setFilterBy} />
                :
                <SearchIcon sx={{ color: '#eee', fontSize: 20 }} />
            }
            <input
                type={'search'}
                placeholder='search...'
                onChange={e => handler(e.target.value)}
            />
        </div>
    );
};

const FilterableSearchbar = ({ list, setFilterBy }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = item => {
        setAnchorEl(null);
        setFilterBy(item);
    };

    return (
        <div>
            <FilterAltOutlinedIcon
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                id="filter-icon"
                onClick={handleClick}
                sx={{ color: '#fff', fontSize: 'large', mt: 1 }}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'filter-icon',
                }}
            >
                {list.map((item, index) => <MenuItem
                    onClick={() => handleClose(index)}
                    key={index}
                >{item}</MenuItem>)}
            </Menu>
        </div>
    );
};

export default Searchbar;