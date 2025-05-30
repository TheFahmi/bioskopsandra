import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const API_URL = "http://localhost:2000"; // Consistent naming for API URL

class Home extends Component {
  state = {
    dataMovies: [],
    readMoreMap: {}, 
    error: null // Added for API error handling
  };

  toggleReadMore = (movieId) => {
    this.setState(prevState => ({
      readMoreMap: {
        ...prevState.readMoreMap,
        [movieId]: !prevState.readMoreMap[movieId]
      }
    }));
  };

  renderMovies = () => {
    return this.state.dataMovies.map((movie) => {
      const isReadMore = this.state.readMoreMap[movie.id];
      const synopsisToShow = isReadMore ? movie.synopsys : movie.synopsys.substring(0, 100) + (movie.synopsys.length > 100 ? "..." : "");

      return (
        <Col xs={12} sm={6} md={4} lg={3} key={movie.id} className="mb-4 d-flex align-items-stretch">
          <Card className="h-100 shadow-sm">
            <Link to={`/moviedetail/${movie.id}`} style={{ textDecoration: 'none' }}>
              <Card.Img variant="top" src={movie.image} alt={movie.title} style={{ objectFit: 'cover', height: '300px' }} />
            </Link>
            <Card.Body className="d-flex flex-column">
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text style={{ flexGrow: 1 }}>
                {synopsisToShow}
              </Card.Text>
              <Button 
                variant="primary" 
                onClick={() => this.toggleReadMore(movie.id)}
                className="mt-auto"
              >
                {isReadMore ? "Show Less" : "Read More"}
              </Button>
            </Card.Body>
            {isReadMore && (
              <Card.Footer>
                <small className="text-muted">Genre: {movie.genre}</small><br/>
                <small className="text-muted">Duration: {movie.durasi} minutes</small><br/>
                <small className="text-muted">Director: {movie.sutradara}</small> 
              </Card.Footer>
            )}
          </Card>
        </Col>
      );
    });
  };

  componentDidMount() {
    Axios.get(`${API_URL}/movies`)
      .then(res => {
        this.setState({ dataMovies: res.data, error: null });
      })
      .catch(err => {
        // console.log(err);
        this.setState({ error: "Failed to fetch movies. Please try again later.", dataMovies: [] });
      });
  }

  render() {
    if (this.state.error) {
      return (
        <Container className="py-5 text-center">
          <Alert variant="danger">{this.state.error}</Alert>
        </Container>
      );
    }

    return (
      <Container fluid className="py-5">
        <Row className="px-md-5 justify-content-center"> {/* Added justify-content-center for better alignment if few cards */}
          {this.state.dataMovies.length > 0 ? this.renderMovies() : (
            <Col xs={12} className="text-center">
              <p>No movies available at the moment.</p>
            </Col>
          )}
        </Row>
      </Container>
    );
  }
}

export default Home;
