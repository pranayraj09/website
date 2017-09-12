import React, { Component } from 'react';
import { Card, CardTitle, CardText, Row, Col , Jumbotron, Container,Button, ListGroup, ListGroupItem, Collapse, CardBlock } from 'reactstrap';
import CollapseEdu from './Collapse';

class EducationCard extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: {} };
    }

    toggle(elementId) {
        Object.keys(this.state.collapse).forEach((key) => {
            if(key !== elementId){
                console.log('key',key, this.state.collapse);
                this.setState({
                    collapse: {
                        ...this.state.collapse,
                        [key]: false
                    }
                });
            }
        });
        this.setState({
            collapse: {
                ...this.state.collapse,
                [elementId]: !this.state[elementId]
            }
        });
        console.log(this.state[elementId], elementId, this.state.collapse);
    }

    render() {
        return (
            <Card block>
                <CardTitle>Education</CardTitle>
                <CardText>Skill text goes here.</CardText>
                <ListGroup>
                    <CollapseEdu
                        title="Test 1"
                        collapse={this.state.collapse['test1']}
                        toggle={() => this.toggle('test1')}
                        content="Content 1" />
                    <CollapseEdu
                        title="Test 2"
                        collapse={this.state.collapse['test2']}
                        toggle={() => this.toggle('test2')}
                        content="Content 2" />
                </ListGroup>
            </Card>
        );
    }
}

export default EducationCard

// <div>
// <ListGroupItem onClick={this.toggle}>MASTER DEGREE - INFORMATION TECHNOLOGY AND MANAGEMENT - ILLINOIS INSTITUTE OF TECHNOLOGY, CHICAGO, 2014-2016
// </ListGroupItem>
// <Collapse isOpen={this.state.collapse}>
// <Card>
// <CardBlock>
// One
// </CardBlock>
// </Card>
// </Collapse>
// </div>
// <div>
// <ListGroupItem onClick={this.toggle}>BACHELOR DEGREE - JNTU HYDERABAD, 2009-2013</ListGroupItem>
// <Collapse isOpen={this.state.collapse}>
// <Card>
// <CardBlock>
// Two
// </CardBlock>
// </Card>
// </Collapse>
// </div>
// <div>
// <ListGroupItem onClick={this.toggle}>HIGHER SECONDARY EDUCATION - NARAYANA COLLEGE, 2007-2009</ListGroupItem>
// <Collapse isOpen={this.state.collapse}>
// <Card>
// <CardBlock>
// Two
// </CardBlock>
// </Card>
// </Collapse>
// </div>