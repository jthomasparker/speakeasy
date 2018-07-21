import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact'

// UserBrainsDropdown renders a bootstrap list item
export const UserBrainsDropdown = props => (
    <Dropdown>
        <DropdownToggle caret color="primary">
        Your Brains
        </DropdownToggle>
          <DropdownMenu>
            {props.children}
          </DropdownMenu>
        </Dropdown>
  );
  
  