import React from "react";

const AddedTable = props => (
    <div>
        <table className="table table-hover">
    <thead>
        <tr>
        <th scope="col">Input</th>
        <th scope="col">Classification</th>
        </tr>
    </thead>
    <tbody>
        {/* for loop to add date */}
        <tr className="table-light">
        <th scope="row">Light</th>
        <td>Column content</td>
        <td>remove</td>
        </tr>
    </tbody>
</table> 
    </div>
)

export default AddedTable;

