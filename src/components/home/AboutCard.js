import React, { Component } from 'react';
import { Card, Button, CardTitle, CardText, Row, Col, CardImg, Modal, ModalBody } from 'reactstrap';

class AboutCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (

            <Card block>
                <Row>
                    <Col sm="8">
                        <CardTitle>Hello</CardTitle>
                        <CardText>My name is Pranay</CardText>
                        <Button onClick={this.toggle}>View Resume</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                            <ModalBody>
                                This is the Modal sample
                            </ModalBody>
                        </Modal>
                    </Col>
                    <Col sm="4">
                        <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                    </Col>
                </Row>
            </Card>
        )
    }
}

export default AboutCard;
