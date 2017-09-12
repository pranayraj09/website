import React, { Component } from 'react';
import { Card, CardTitle, CardText, Row, Col , Jumbotron, Container, Badge, Progress } from 'reactstrap';

class SkillsCard extends Component{
    render(){
        return(
            <Card block>
                <CardTitle>My Skills</CardTitle>
                <CardText>Skill text goes here Skill text goes here Skill text goes here
                    Skill text goes here
                    Skill text goes here
                    Skill text goes hereSkill text goes here
                    Skill text goes here
                    Skill text goes here
                    Skill text goes here
                    Skill text goes here </CardText>
                <div>
                    <Badge pill> default </Badge>{'  '}
                    <Badge pill> default </Badge>{'  '}
                    <Badge pill> default </Badge>{'  '}
                    <Badge pill> default </Badge>{'  '}
                </div>
                <div>
                    <Jumbotron fluid>
                        <Container fluid>
                            <h5>Professional Skills</h5>
                        </Container>
                        <div className="progress-bars">
                            <Row>
                                <Col md="6" lg="6">
                                    <Row>
                                        <Col md="2" lg="2">
                                            <span>Photoshop</span>
                                        </Col>
                                        <Col md="10" lg="10">
                                            <Progress className="bars" color="success" value="60">60%</Progress>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="2" lg="2">
                                            <span>Jquery</span>
                                        </Col>
                                        <Col md="10" lg="10">
                                            <Progress className="bars" color="danger" value="75">75%</Progress>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="2" lg="2">
                                            <span>PHP</span>
                                        </Col>
                                        <Col md="10" lg="10">
                                            <Progress className="bars" color="info" value="65">65%</Progress>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="6" lg="6">
                                    <Row>
                                        <Col md="2" lg="2">
                                            <span>HTML5</span>
                                        </Col>
                                        <Col md="10" lg="10">
                                            <Progress className="bars" color="warning" value="90">90%</Progress>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="2" lg="2">
                                            <span>CSS 3</span>
                                        </Col>
                                        <Col md="10" lg="10">
                                            <Progress className="bars" color="info" value="40">40%</Progress>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="2" lg="2">
                                            <span>Marketing</span>
                                        </Col>
                                        <Col md="10" lg="10">
                                            <Progress className="bars" color="danger" value="84">84%</Progress>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </div>
                    </Jumbotron>

                </div>


            </Card>
        )

    }
}

export default SkillsCard;