import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const WelcomePages = () => { // Renamed component to follow PascalCase convention
  const jumbotronStyle = {
    backgroundImage: `url(https://mediafiles.cinema.com.hk/broadway/cmsimg/cinweb/webcms/images/4e046e519a547af95b0b46ddd49a882c_1564395125.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: '5rem', // Replicating py-5 (rough equivalent)
    paddingBottom: '5rem', // Replicating py-5 (rough equivalent)
    marginTop: '3rem', // Replicating my-5 (rough equivalent for top)
    marginBottom: '3rem', // Replicating my-5 (rough equivalent for bottom)
  };

  return (
    // Using Container fluid to allow the jumbotron-like section to span more width if desired,
    // or could be a regular Container for fixed width.
    // MDBContainer seemed to be used as a general wrapper, so Container fluid might be too wide.
    // Let's stick to a standard Container for now.
    <Container className="my-5"> 
      <Row>
        <Col>
          {/* Replicating Jumbotron effect with a div and Bootstrap classes */}
          <div style={jumbotronStyle} className="text-white text-center rounded-3">
            {/* Inner Col for padding, similar to the original structure */}
            <div className="py-5 px-4"> 
              <h1 className="display-4 fw-bold pt-3 mb-4"> {/* display-* for large text, fw-bold */}
                Create your beautiful website with MDBootstrap 
              </h1> {/* Changed m-5 to mb-4 as m-5 on h1 is quite large */}
              <p className="lead mx-md-5 mb-0"> {/* lead for larger paragraph text, mx-md-5 for horizontal margin on medium+ screens, mb-0 as it's the last element */}
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat fugiat, laboriosam, voluptatem,
                optio vero odio nam sit officia accusamus minus error nisi architecto nulla ipsum dignissimos. Odit sed qui, dolorum!
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomePages;
