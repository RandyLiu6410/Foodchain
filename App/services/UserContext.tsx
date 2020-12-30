import React from 'react';

const UserContext = React.createContext({
    name: 'Guest',
    logorg: 111,
});

export default UserContext;