import React from "react";
import {DropdownItem} from 'mdbreact';

// RecipeListItem renders a bootstrap list item containing data from the recipe api call
const UserBrainItem = props => (
  <DropdownItem href="/braintrain/" >{props.name}</DropdownItem >
);

export default UserBrainItem;