/*!
=========================================================
* Argon Dashboard React - v1.2.4
=========================================================
* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim
* Licensed under MIT
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

interface AdminNavbarProps {
  brandText: string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ brandText }) => {
  return (
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
      <Container fluid>
        <Link href="/" passHref legacyBehavior>
          <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
            {brandText}
          </a>
        </Link>
        <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
          <FormGroup className="mb-0">
            <InputGroup className="input-group-alternative">
              <InputGroup className="input-group-alternative">
                <InputGroupText>
                  <i className="fas fa-search" />
                </InputGroupText>
                <Input placeholder="Search" type="text" />
              </InputGroup>

              <Input placeholder="Search" type="text" />
            </InputGroup>
          </FormGroup>
        </Form>
        <Nav className="align-items-center d-none d-md-flex" navbar>
          <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0" nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <Image
                    alt="User Profile"
                    src="/assets/img/theme/team-4-800x800.jpg"
                    width={40}
                    height={40}
                    className="rounded-circle"
                  />
                </span>
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold">
                    Jessica Jones
                  </span>
                </Media>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem>
                <Link href="/admin/user-profile" legacyBehavior>
                  <a className="d-flex align-items-center">
                    <i className="ni ni-single-02" />
                    <span className="ml-2">My profile</span>
                  </a>
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link href="/admin/user-profile" legacyBehavior>
                  <a className="d-flex align-items-center">
                    <i className="ni ni-settings-gear-65" />
                    <span className="ml-2">Settings</span>
                  </a>
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link href="/admin/user-profile" legacyBehavior>
                  <a className="d-flex align-items-center">
                    <i className="ni ni-calendar-grid-58" />
                    <span className="ml-2">Activity</span>
                  </a>
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link href="/admin/user-profile" legacyBehavior>
                  <a className="d-flex align-items-center">
                    <i className="ni ni-support-16" />
                    <span className="ml-2">Support</span>
                  </a>
                </Link>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
