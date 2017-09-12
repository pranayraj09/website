import React, { Component } from 'react';
import { Card,  ListGroupItem, Collapse, CardBlock } from 'reactstrap';

class CollapseEdu extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        const { collapse } = this.props;
        console.log('collapse', collapse);
        return (
            <div>
                <ListGroupItem onClick={this.props.toggle}>
                    { this.props.title }
                </ListGroupItem>
                <Collapse isOpen={collapse}>
                            <Card>
                                <CardBlock>
                                    { this.props.content }
                                </CardBlock>
                            </Card>
                        </Collapse>
                    </div>
        );
    }
}

export default CollapseEdu;