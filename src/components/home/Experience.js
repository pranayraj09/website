import React, { Component } from 'react';
import { Card, CardTitle, CardText, Row, Col , CardHeader, CardBlock, Jumbotron, Container } from 'reactstrap';

class Experience extends Component {
    render() {
        return (
            <Card block>
                <CardTitle>Experience</CardTitle>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <div>
                    <Row>
                        <Col md="8" lg="8">
                            <Card>
                                <CardHeader>Header</CardHeader>
                                <CardBlock>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural.</CardText>
                                </CardBlock>
                            </Card>
                            <Card>
                                <CardHeader tag="h3">Featured</CardHeader>
                                <CardBlock>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural.</CardText>
                                </CardBlock>
                            </Card>
                            <Card>
                                <CardHeader tag="h3">Featured</CardHeader>
                                <CardBlock>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural.</CardText>
                                </CardBlock>
                            </Card>
                        </Col>
                        <Col md="4" lg="4">
                            <Card>
                                <CardHeader>Header</CardHeader>
                                <CardBlock>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural.</CardText>
                                </CardBlock>
                            </Card>

                            <Card>
                                <CardHeader tag="h3">Featured</CardHeader>
                                <CardBlock>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural.</CardText>
                                </CardBlock>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        )
    }
}

export default Experience;