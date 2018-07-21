import React, { Component } from 'react';
import { Popover, Tooltip, Button, Modal, OverlayTrigger } from 'react-bootstrap';

class CreateBrainModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    
        this.state = {
          show: false
        };
      }

      handleClose() {
        this.setState({ show: false });
      }
    
      handleShow() {
        this.setState({ show: true });
      }

      render() {
        const popover = (
          <Popover id="modal-popover" title="popover">
            very popover. such engagement
          </Popover>
        );
        const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
    
        return (
          <div>
            <p>Click to get the full Modal experience!</p>
    
            <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
              Launch demo modal
            </Button>
    
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>Text in a modal</h4>
                <p>
                  Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleClose}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
    }
    
export default CreateBrainModal