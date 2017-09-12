import React, { Component } from 'react';
import Navigation from '../components/Navigation'
import Sidebar from '../components/Sidebar';
import AboutCard from '../components/home/AboutCard';
import AboutInfoCard from '../components/home/AboutInfoCard';
import { Row, Col } from 'reactstrap';
import SkillsCard from "../components/home/SkillsCard";
import EducationCard from "../components/home/Education";
import Portfolio from "../components/home/Portfolio";
import Experience from "../components/home/Experience";
import ContactMe from "../components/home/ContactMe";

class Home extends Component {
    render() {
        return (
            <main>
                <Row>
                    <Col md="3" lg="3">
                        <Sidebar />

                    </Col>
                    <Col md="9" lg="9">
                        <Navigation />
                        <AboutCard />
                        <AboutInfoCard />
                        <SkillsCard/>
                        <EducationCard/>
                        <Portfolio/>
                        <Experience/>
                        <ContactMe/>
                    </Col>
                </Row>
            </main>
        )
    }
}

export default Home;
