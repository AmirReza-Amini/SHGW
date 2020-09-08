// import external modules
import React, { Component } from "react";

import { Home, LogIn, ChevronRight } from "react-feather";
import { NavLink } from "react-router-dom";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";
import * as auth from "../../../../services/authService";
import { boolean, bool } from "yup";

class SideMenuContent extends Component {

  constructor(props) {
    super(props)
    this.state = { user: {}, isAdmin: false };
  }
  componentWillMount() {
    const user = auth.getCurrentUser();
    const isAdmin = user.userType === "Admin" ? true : false;
    this.setState({ user, isAdmin });
    console.log('from side cwm')
  }
  render() {
    console.log('from sidemenu', this.state)

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
          <NavLink to="/logout" activeclassname="active">
            <i className="menu-icon">
              <LogIn size={18} />
            </i>
            <span className="menu-item-text">Logout</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuSingleItem  >
          <NavLink to="/operationType" activeClassName="active" >
            <i className="menu-icon">
              <Home size={18} />
            </i>
            <span className="menu-item-text">Operation Type</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuMultiItems
          hidden={!this.state.isAdmin}
          name="Admin"
          Icon={<Home size={18} />}
          ArrowRight={<ChevronRight size={16} />}
          collapsedSidebar={this.props.collapsedSidebar}
        >
          <NavLink to="/" exact className="item" activeclassname="active">
            <span className="menu-item-text">Dashboard</span>
          </NavLink>
          <NavLink to="/users" exact className="item" activeclassname="active">
            <span className="menu-item-text">Users</span>
          </NavLink>
        </SideMenu.MenuMultiItems>
      </SideMenu>
    );
  }
}

export default SideMenuContent;
