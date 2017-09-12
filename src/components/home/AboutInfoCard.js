import React, { Component } from 'react';
import { Card, CardTitle, CardText, Row, Col , CardHeader, CardBlock, Form, FormGroup, Button, Label, Input } from 'reactstrap';
import "./home.css";

class AboutInfoCard extends Component {
    render() {
        return (
            <Card block>
                <CardTitle>About Me</CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <div>
                    <Row>
                        <Col md="6" lg="6">
                            <div block className="badge-blocks">
                                <Card className="badges">
                                    <CardHeader>Logo</CardHeader>
                                    <CardBlock>
                                        <CardText>Logo Design</CardText>
                                    </CardBlock>
                                </Card>
                                <Card className="badges">
                                    <CardHeader>Logo</CardHeader>
                                    <CardBlock>
                                        <CardText>Website</CardText>
                                    </CardBlock>
                                </Card>
                                <Card className="badges">
                                    <CardHeader>Logo</CardHeader>
                                    <CardBlock>
                                        <CardText>Softwares</CardText>
                                    </CardBlock>
                                </Card>
                                <Card className="badges">
                                    <CardHeader>Logo</CardHeader>
                                    <CardBlock>
                                        <CardText>Applications</CardText>
                                    </CardBlock>
                                </Card>
                            </div>
                        </Col>
                        <Col md="6" lg="6">
                            <Card block>
                                <Form>
                                    <Label>Personal Details</Label>
                                    <FormGroup row>
                                        <Label sm={2}>Name</Label>
                                        <Col sm={10}>
                                            <Label> Pranay Raj Kyatham</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Address</Label>
                                        <Col sm={10}>
                                            <Label> 202 Calvert Dr, Cupertino, Californa</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Zipcode</Label>
                                        <Col sm={10}>
                                            <Label> 95014</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Phone</Label>
                                        <Col sm={10}>
                                            <Label> +1(312) Eight o 4 - three 7 Eight o</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Email</Label>
                                        <Col sm={10}>
                                            <Label> kyatham.pranay(at)gmail.com</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Website</Label>
                                        <Col sm={10}>
                                            <Label> https://www.pranayraj.com</Label>
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

export default AboutInfoCard;
