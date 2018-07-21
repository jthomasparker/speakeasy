import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact'

class DropdownPage extends React.Component {
  render() {
    return (
      <Dropdown>
      <DropdownToggle caret color="primary">
      Material dropdown
      </DropdownToggle>
        <DropdownMenu>
          <DropdownItem href="#">Action</DropdownItem>
          <DropdownItem href="#">Another Action</DropdownItem>
          <DropdownItem href="#">Something else here</DropdownItem>
          <DropdownItem href="#">Something else here</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DropdownPage;