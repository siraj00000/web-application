import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link } from '@mui/material';
import withRouter from '../utils/withRouter';

const BreadCrumbs = props => {
    const { location: { pathname }, navigate } = props?.router;
    const pathnames = pathname.split('/').filter(x => x);
    // Won't allow to render on homepage
    const navigationHandler = (path, condition) => {
        if (path === 'ls-admin') return navigate(`/${path}`);
        else if (!condition) navigate(`/ls-admin/${path}`);
    };
    return (
        <div>
            <MUIBreadcrumbs aria-label="breadcrumb">
                {pathnames.map((name, index) => {
                    let lastPath = pathnames[pathnames.length - 1] === name;
                    let matchPath = name === 'ls-admin';
                    return (
                        <Link
                            key={index}
                            color={lastPath ? 'primary' : 'inherit'}
                            sx={{ cursor: 'pointer', textDecoration: 'none' }}
                            onClick={() => navigationHandler(name, lastPath)}>
                            {matchPath ? "Home" : name}
                        </Link>
                    );
                })}
            </MUIBreadcrumbs>
        </div>
    );
};

export default withRouter(BreadCrumbs);