// import external modules
import React, { Component } from "react";

import { Home, LogIn, ChevronRight } from "react-feather";
import { NavLink } from "react-router-dom";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";
import * as auth from "../../../../services/authService";
import config from '../../../../config.json';
import urls from '../../../../urls.json';
import ReactRevealText from 'react-reveal-text'

class SideMenuContent extends Component {

  constructor(props) {
    super(props)
    this.state = { user: {}, isAdmin: false, hasRoles: false, showUserInfo: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showUserInfo: true });
    }, 1500);
  }

  componentWillMount() {
    if (!config.useAuthentication) {
      this.setState({ isAdmin: true });
    }
    else {
      const user = auth.getCurrentUser();
      const isAdmin = user.userType === "Admin" ? true : false;
      this.setState({ user, isAdmin });
      const roles = user.permissions.filter(c => c.isGranted === true);
      this.setState({ hasRoles: roles.length > 0 ? true : false });
      //console.log('from side cwm')
    }

  }
  render() {
    //console.log('from sidemenu', this.state)

    return (
      <SideMenu
        className="sidebar-content"
        toggleSidebarMenu={this.props.toggleSidebarMenu}
      >
        <SideMenu.MenuSingleItem badgeColor="danger">
          <ReactRevealText style={{ color: "White", fontSize: 18 }} className="m-3" show={this.state.showUserInfo} text={'Welcome ' + this.state.user.firstName}>
          </ReactRevealText>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuSingleItem badgeColor="danger">
          <NavLink to={urls.Home} activeclassname="active">
            <i className="menu-icon">
              <Home size={18} />
            </i>
            <span className="menu-item-text">Home</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
        <SideMenu.MenuSingleItem hidden={!this.state.hasRoles}>
          <NavLink to={urls.OperationType} activeClassName="active" >
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
          <NavLink to={urls.Dashboard} exact className="item" activeclassname="active">
            <span className="menu-item-text">Dashboard</span>
          </NavLink>
          <NavLink to={urls.Users} exact className="item" activeclassname="active">
            <span className="menu-item-text">Users</span>
          </NavLink>
        </SideMenu.MenuMultiItems>
        <SideMenu.MenuSingleItem badgeColor="danger">
          <NavLink to={urls.Logout} activeclassname="active">
            <i className="menu-icon">
              <LogIn size={18} />
            </i>
            <span className="menu-item-text">Logout</span>
          </NavLink>
        </SideMenu.MenuSingleItem>
      </SideMenu>
    );
  }
}

export default SideMenuContent;
