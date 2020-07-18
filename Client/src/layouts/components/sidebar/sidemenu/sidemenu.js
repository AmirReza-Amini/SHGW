// import external modules
import React, { Component } from "react";

import { Home, LogIn } from "react-feather";
import { NavLink } from "react-router-dom";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";

class SideMenuContent extends Component {
  render() {
    return (
      <SideMenu
        className="sidebar-content"
        toggleSidebarMenu={this.props.toggleSidebarMenu}
      >
        <SideMenu.MenuSingleItem badgeColor="danger">
          <NavLink to="/" activeclassname="active">
            <i className="menu-icon">
              <Home size={18} />
            </i>
            <span className="menu-item-text">Home</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuSingleItem badgeColor="danger">
          <NavLink to="/login" activeclassname="active">
            <i className="menu-icon">
              <LogIn size={18} />
            </i>
            <span className="menu-item-text">Login</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuSingleItem>
          <NavLink to="/operationType" activeClassName="active">
            <i className="menu-icon">
              <Home size={18} />
            </i>
            <span className="menu-item-text">Operation Type</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
      </SideMenu>
    );
  }
}

export default SideMenuContent;
