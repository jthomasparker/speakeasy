import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const AddedTable = () => (
    <div>
        <BootstrapTable striped hover>
            <TableHeaderColumn isKey dataField='props.input'>Input</TableHeaderColumn>
            <TableHeaderColumn dataField='props.classification'>Classification</TableHeaderColumn>
            {/* <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn> */}
        </BootstrapTable>
    </div>
)

export default AddedTable;

