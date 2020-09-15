import React from "react";

const LogoutLayout = ({ children, ...rest }) => {
    return (
        <main className="main">{children}</main>
    );
};

export default LogoutLayout;
