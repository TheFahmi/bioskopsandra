import React, { Component } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/ApiUrl';
import { Modal, Button, Container, Row, Col, Image, ListGroup } from 'react-bootstrap'; // Added Button, Container, Row, Col, Image, ListGroup
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class MovieDetail extends Component {
    state = { 
        datadetailfilm: null, // Initialize as null to easily check for loading
        traileropen: false,
        notloginyet: false,
        kelogin: false,
        belitiketok: false,
        loading: true, // Added loading state
        error: null    // Added error state
    }
    
    componentDidMount() {
        this.setState({ loading: true, error: null });
        Axios.get(`${APIURL}movies/${this.props.match.params.id}`)
            .then(res => {
                this.setState({ datadetailfilm: res.data, loading: false });
            }).catch(err => {
                 // console.log(err);
                this.setState({ error: "Failed to load movie details.", loading: false });
            });
    }

    onBeliTicketClick = () => {
        if (this.props.AuthLog) {
            this.setState({ belitiketok: true });
        } else {
            this.setState({ notloginyet: true });
        }   
    }

    handleCloseNotLoginYetModal = () => {
        this.setState({ notloginyet: false });
    }

    handleRedirectToLogin = () => {
        this.setState({ notloginyet: false, kelogin: true });
    }

    render() { 
        if (this.state.kelogin) {
            // Pass movie details to login, so it can redirect back or use data after login
            return <Redirect to={{ pathname: "/login", state: { from: this.props.location, movieDetails: this.state.datadetailfilm } }} />;
        }
        if (this.state.belitiketok) {
            return <Redirect to={{ pathname: '/belitiket', state: this.state.datadetailfilm }} />;
        }

        if (this.state.loading) {
            return (
                <Container className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading movie details...</p>
                </Container>
            );
        }

        if (this.state.error) {
            return (
                <Container className="text-center py-5">
                    <Alert variant="danger">{this.state.error}</Alert>
                </Container>
            );
        }
        
        if (!this.state.datadetailfilm) { // Should not happen if loading/error are handled, but as a fallback
            return (
                <Container className="text-center py-5">
                    <Alert variant="warning">Movie data not available.</Alert>
                </Container>
            );
        }

        const { title, image, trailer, synopsys, genre, durasi, sutradara, cast } = this.state.datadetailfilm;

        return ( 
            <Container fluid className="py-4">
                {/* Trailer Modal */}
                <Modal show={this.state.traileropen} size='lg' onHide={() => this.setState({ traileropen: false })} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{title} - Trailer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0" style={{ height: '70vh' }}>
                        {trailer && (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                title={title}  
                                src={trailer.replace("watch?v=", "embed/")} // Ensure embed URL for iframe
                                frameBorder="0" 
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        )}
                    </Modal.Body>
                </Modal>

                {/* Not Login Yet Modal */}
                <Modal show={this.state.notloginyet} onHide={this.handleCloseNotLoginYetModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Authentication Required</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Anda harus login terlebih dahulu untuk membeli tiket.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseNotLoginYetModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleRedirectToLogin}>
                            Login
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Row>
                            <Col md={5} className="text-center text-md-start mb-3 mb-md-0">
                                <Image src={image} alt={title} fluid rounded className="shadow"/>
                            </Col>
                            <Col md={7}>
                                <h2>{title}</h2>
                                <hr/>
                                <p><strong>Synopsis:</strong> {synopsys}</p>
                                <ListGroup variant="flush">
                                    {genre && <ListGroup.Item><strong>Genre:</strong> {genre}</ListGroup.Item>}
                                    {durasi && <ListGroup.Item><strong>Duration:</strong> {durasi} minutes</ListGroup.Item>}
                                    {sutradara && <ListGroup.Item><strong>Director:</strong> {sutradara}</ListGroup.Item>}
                                    {cast && <ListGroup.Item><strong>Cast:</strong> {cast}</ListGroup.Item>}
                                </ListGroup>
                                <div className="mt-4">
                                    <Button variant="primary" className="me-2" onClick={this.onBeliTicketClick}>
                                        Beli Tiket
                                    </Button>
                                    {trailer && (
                                        <Button variant="outline-warning" onClick={() => this.setState({ traileropen: true })}>
                                            View Trailer
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}
 
const MapstateToprops = (state) => {
    return {
      AuthLog: state.Auth.login
    }
}
export default connect(MapstateToprops)(MovieDetail);
