import React, { Component } from 'react';
import { Card, CardTitle, CardText, Row, Col , CardHeader, CardBlock, Jumbotron, Container, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class ContactMe extends Component {
    render() {
        return (
            <Card block>
                <CardTitle>Contact Me</CardTitle>
                <CardText> Feel free to reach me over the email mentioned on this website or call me over to have a quick chat.</CardText>
                <div>
                    <Row>
                        <Col md="6" lg="6">
                            <Card>
                                <CardHeader>PHONE</CardHeader>
                                <CardBlock>
                                    <CardText>Mobile : +1 (312) eight o four - three 7 eight o</CardText>
                                    <CardText>skype: kyatham.pranay</CardText>
                                    <CardText>Linkedin: linkedin.com/in/pranayraj09</CardText>
                                </CardBlock>
                            </Card>
                            <Card>
                                <CardHeader>EMAIL</CardHeader>
                                <CardBlock>
                                    <CardText>Special Title Treatment</CardText>
                                    <CardText>With supporting text below as a natural.</CardText>
                                </CardBlock>
                            </Card>
                            <Card>
                                <CardHeader>ADDRESS</CardHeader>
                                <CardBlock>
                                    <CardText>202 calvert drive</CardText>
                                    <CardText>Cupertino, CA - 95014</CardText>
                                </CardBlock>
                            </Card>
                        </Col>
                        <Col md="6" lg="6">
                            <Card>
                                <Form>
                                    <FormGroup>
                                        <Label for="exampleName">Here Me</Label>
                                        <Input type="text" name="Name" id="exampleName" placeholder="Enter Name" />
                                        <Input type="email" name="email" id="exampleEmail" placeholder="Enter Email" />
                                        <Input type="text" name="subject" id="exampleSubject" placeholder="Enter Subject"/>
                                        <Input type="textarea" name="text" id="exampleText" />
                                    </FormGroup>
                                    <FormGroup check row>
                                        <Col sm={{ size: 10, offset: 2 }}>
                                            <Button>Submit</Button>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        )
    }
}

export default ContactMe;