import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';

export class NavMenu extends Component {
  displayName = NavMenu.name

  render() {
    return (
        <Navbar inverse fixedTop fluid collapseOnSelect className="d-inline-block align-top">
        <Navbar.Header>
          <Navbar.Brand>
            ToDo
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to={'/'} exact>
              <NavItem>
                <Glyphicon glyph='home' /> Home
              </NavItem>
                    </LinkContainer> 
                    <LinkContainer to={'/ToDo'}>
                        <NavItem>
                            <Glyphicon glyph='edit' /> ToDoList
          </NavItem>
                    </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
