import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'slategrey',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999
  };

  const cardStyle = {
    backgroundColor: '#343a40',
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  };

  const iconStyle = {
    fontSize: '8rem',
    color: '#dc3545',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '1rem',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#adb5bd',
    marginBottom: '2rem'
  };

  const buttonStyle = {
    backgroundColor: '#5b0008',
    borderColor: '#5b0008',
    padding: '12px 30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: '25px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card style={cardStyle} className="text-center p-5">
              <Card.Body>
                {/* Cinema Film Reel Icon */}
                <div style={iconStyle} className="mb-4">
                  🎬
                </div>
                
                <h1 style={titleStyle}>404</h1>
                
                <h2 className="text-white mb-3">Halaman Tidak Ditemukan</h2>
                
                <p style={subtitleStyle}>
                  Maaf, halaman yang Anda cari tidak dapat ditemukan. 
                  Mungkin halaman tersebut telah dipindahkan, dihapus, 
                  atau Anda salah mengetik alamat URL.
                </p>
                
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Button 
                    as={Link} 
                    to="/" 
                    style={buttonStyle}
                    className="btn-lg"
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#7a000b';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#5b0008';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🏠 Kembali ke Beranda
                  </Button>
                  
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-light"
                    className="btn-lg"
                    style={{
                      borderRadius: '25px',
                      padding: '12px 30px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    🎭 Login
                  </Button>
                </div>
                
                <div className="mt-4 pt-3 border-top border-secondary">
                  <small className="text-muted">
                    Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Additional Cinema-themed decorative elements */}
        <Row className="mt-4">
          <Col className="text-center">
            <div style={{ fontSize: '2rem', opacity: 0.3 }}>
              🍿 🎪 🎥 🎞️ 🎬
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
