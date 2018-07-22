//ModalComponent.js
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./CreateBrainModal.css";
import API from "../../utils/API";

export default class CreateBrainModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modal: false,name: ''};

    this.toggle = this.toggle.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  let brainName = this.state.name
  console.log(brainName)
  API.createNet({
    netName: brainName
  })
    .then(res => {
      console.log(res)
      this.setState({
        netId: res.data.netId,
        netName: res.data.netName
      });
      this.toggle();
    })
  }


  render() {
    return (
        <div>          
        <Button color="warning" onClick={this.toggle}>Create New Brain</Button>
        <Modal isOpen={this.state.modal}>
        <form onSubmit={this.handleSubmit}>
          <ModalHeader>Name Your New Brain</ModalHeader>
          <ModalBody>
          <div className="row">
            <div className="form-group col-md-12">
            <label>Name:</label>
            <input type="text" value={this.state.name} onChange={this.handleChangeName} className="form-control" />
              </div>
              </div>            
          </ModalBody>
          <ModalFooter>
            <input type="submit" value="Submit" color="primary" className="btn btn-primary" />
            <Button color="danger" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
          </form>
        </Modal>
        </div>
      
    );
  }
}
