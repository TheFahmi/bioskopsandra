import React, { Component } from "react";
import { Table, Modal, Button, Form, Container, Row, Col, Spinner, Image, Badge } from "react-bootstrap"; // React-Bootstrap imports
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Fade from "react-reveal/Fade"; // react-reveal is not part of this refactor, kept as is
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { connect } from "react-redux";

const Myswal = withReactContent(Swal);

class ManageAdmin extends Component {
  state = {
    dataFilm: [],
    modaladd: false,
    modaledit: false,
    indexedit: 0,
    // iddelete: -1, // Not strictly needed if using index or id directly in delete
    jadwal: [12, 14, 16, 18, 20, 22], // Default schedule template
    datastudio: [],
    loading: true, // Added for initial data load
    readmoreselected: -1 // For synopsis read more
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ loading: true });
    Axios.get(`${APIURL}movies`)
      .then(resMovies => {
        Axios.get(`${APIURL}studios`)
          .then(resStudios => {
            this.setState({
              dataFilm: resMovies.data,
              datastudio: resStudios.data,
              loading: false
            });
          })
          .catch(errStudios => {
            console.log(errStudios);
            this.setState({ loading: false });
            Myswal.fire("Error", "Failed to fetch studio data.", "error");
          });
      })
      .catch(errMovies => {
             // console.log(errStudios);
         // console.log(errMovies);
        this.setState({ loading: false });
        Myswal.fire("Error", "Failed to fetch movie data.", "error");
      });
  }

  onUpdateDataClick = () => {
    const { jadwal: jadwaltemplate, dataFilm, indexedit, datastudio } = this.state;
    let newJadwal = [];
    for (let i = 0; i < jadwaltemplate.length; i++) {
      if (this.refs[`editjadwal${i}`] && this.refs[`editjadwal${i}`].checked) {
        newJadwal.push(jadwaltemplate[i]);
      }
    }

    const currentFilm = dataFilm[indexedit];
    const updatedData = {
      title: this.refs.edittitle.value,
      image: this.refs.editimage.value,
      synopsys: this.refs.editsynopsys.value,
      sutradara: this.refs.editsutradara.value,
      genre: this.refs.editgenre.value,
      durasi: parseInt(this.refs.editdurasi.value) || 0,
      jadwal: newJadwal,
      produksi: this.refs.editproduksi.value,
      trailer: this.refs.edittrailer.value,
      studioId: parseInt(this.refs.editstudioId.value) || (datastudio.length > 0 ? datastudio[0].id : "")
    };

    if (Object.values(updatedData).some(val => val === "" || (Array.isArray(val) && val.length === 0)) || !updatedData.studioId) {
      return Myswal.fire("Validation Error", "All fields must be filled, and schedule/studio must be selected.", "error");
    }
    
    Axios.patch(`${APIURL}movies/${currentFilm.id}`, updatedData)
      .then(() => {
        this.fetchData(); // Refresh data
        this.setState({ modaledit: false });
        Myswal.fire("Success!", "Movie data updated successfully.", "success");
      })
      .catch(err => {
        console.log(err);
        Myswal.fire("Error", "Failed to update movie data.", "error");
      });
  };

  onSaveDataClick = () => {
    const { jadwal: jadwaltemplate, datastudio } = this.state;
    let newJadwal = [];
    // Assuming fixed length for jadwal template for add modal
    const addJadwalTemplate = [12, 14, 16, 18, 20, 22]; 
    for (let i = 0; i < addJadwalTemplate.length; i++) {
      if (this.refs[`addjadwal${i}`] && this.refs[`addjadwal${i}`].checked) {
        newJadwal.push(addJadwalTemplate[i]);
      }
    }
    
    const newData = {
      title: this.refs.addtitle.value,
      image: this.refs.addimage.value,
      synopsys: this.refs.addsynopsys.value,
      sutradara: this.refs.addsutradara.value,
      genre: this.refs.addgenre.value,
      durasi: parseInt(this.refs.adddurasi.value) || 0,
      jadwal: newJadwal,
      produksi: this.refs.addproduksi.value,
      trailer: this.refs.addtrailer.value,
      studioId: parseInt(this.refs.addstudioId.value) || (datastudio.length > 0 ? datastudio[0].id : "")
    };

    if (Object.values(newData).some(val => val === "" || (Array.isArray(val) && val.length === 0)) || !newData.studioId) {
      return Myswal.fire("Validation Error", "All fields must be filled, and schedule/studio must be selected.", "error");
    }

    Axios.post(`${APIURL}movies`, newData)
      .then(() => {
        this.fetchData(); // Refresh data
        this.setState({ modaladd: false });
        Myswal.fire("Success!", "New movie added successfully.", "success");
      })
      .catch(err => {
        console.log(err);
        Myswal.fire("Error", "Failed to add new movie.", "error");
      });
  };

  deleteMovie = (id, title) => {
    Myswal.fire({
      title: `Delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        Axios.delete(`${APIURL}movies/${id}`)
          .then(() => {
            this.fetchData(); // Refresh data
            Myswal.fire("Deleted!", `${title} has been deleted.`, "success");
          })
          .catch(err => {
         // console.log(err);
         // console.log(err);
             // console.log(err);
            Myswal.fire("Error", `Failed to delete ${title}.`, "error");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Myswal.fire("Cancelled", `${title} is safe :)`, "info");
      }
    });
  };

  renderMovieRows = () => {
    return this.state.dataFilm.map((val, index) => (
      <tr key={val.id}>
        <td>{index + 1}</td>
        <td>{val.title}</td>
        <td><Image src={val.image} alt={val.title} style={{ maxHeight: '150px', maxWidth: '100px' }} thumbnail /></td>
        <td>
          {val.synopsys.length <= 100 ? val.synopsys : 
            this.state.readmoreselected === index ? (
              <>
                {val.synopsys} <Button variant="link" size="sm" onClick={() => this.setState({ readmoreselected: -1 })}>Read less</Button>
              </>
            ) : (
              <>
                {val.synopsys.substring(0, 100)}... <Button variant="link" size="sm" onClick={() => this.setState({ readmoreselected: index })}>Read more</Button>
              </>
            )
          }
        </td>
        <td className="text-center">
          {val.jadwal.map(j => <Badge bg="secondary" className="m-1 p-2" key={j}>{j}:00</Badge>)}
        </td>
        <td>{val.sutradara}</td>
        <td>{val.genre}</td>
        <td>{val.durasi} min</td>
        <td>{val.produksi}</td>
        <td>
          <Button variant="primary" size="sm" className="me-2 mb-1 w-100" onClick={() => this.setState({ modaledit: true, indexedit: index })}>
            Edit
          </Button>
          <Button variant="danger" size="sm" className="w-100" onClick={() => this.deleteMovie(val.id, val.title)}>
            Delete
          </Button>
        </td>
      </tr>
    ));
  };

  renderScheduleCheckboxes = (type, filmData = null) => {
    // Use a consistent schedule template for adding, can be different for editing if needed
    const scheduleTemplate = this.state.jadwal; 
    const filmSchedule = filmData ? filmData.jadwal : [];

    return scheduleTemplate.map((jam, index) => (
      <Form.Check 
        type="checkbox"
        id={`${type}-jadwal-${jam}`}
        key={jam}
        label={`${jam}:00`}
        ref={`${type}jadwal${index}`}
        defaultChecked={filmSchedule.includes(jam)}
        inline
        className="me-3"
      />
    ));
  };


  render() {
    if (this.props.role !== "admin") {
      return (
        <Container className="text-center mt-5">
          <Alert variant="danger">You are not authorized to view this page.</Alert>
        </Container>
      );
    }

    if (this.state.loading) {
      return (
        <Container className="text-center mt-5">
          <Spinner animation="border" variant="primary" style={{width: "3rem", height: "3rem"}}/>
          <p className="mt-2">Loading data...</p>
        </Container>
      );
    }
    
    const { dataFilm, indexedit, datastudio } = this.state;
    const filmToEdit = dataFilm[indexedit] || {}; // Ensure filmToEdit is an object

    return (
      <Container fluid className="mt-4">
        {/* Add Movie Modal */}
        <Modal show={this.state.modaladd} onHide={() => this.setState({ modaladd: false })} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add New Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" ref="addtitle" placeholder="Enter title" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" ref="addimage" placeholder="Enter image URL" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Synopsis</Form.Label>
                <Form.Control as="textarea" rows={3} ref="addsynopsys" placeholder="Enter synopsis" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Schedule</Form.Label>
                <div>{this.renderScheduleCheckboxes('add')}</div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Trailer URL (Embed)</Form.Label>
                <Form.Control type="text" ref="addtrailer" placeholder="Enter trailer embed URL" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Studio</Form.Label>
                <Form.Select ref="addstudioId">
                  {datastudio.map(studio => <option key={studio.id} value={studio.id}>{studio.nama}</option>)}
                </Form.Select>
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Director</Form.Label>
                    <Form.Control type="text" ref="addsutradara" placeholder="Enter director" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control type="number" ref="adddurasi" placeholder="Enter duration" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control type="text" ref="addgenre" placeholder="Enter genre(s)" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Production House</Form.Label>
                    <Form.Control type="text" ref="addproduksi" placeholder="Enter production house" />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ modaladd: false })}>Cancel</Button>
            <Button variant="success" onClick={this.onSaveDataClick}>Save Movie</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Movie Modal */}
        <Modal show={this.state.modaledit} onHide={() => this.setState({ modaledit: false })} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Movie: {filmToEdit.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" ref="edittitle" defaultValue={filmToEdit.title} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" ref="editimage" defaultValue={filmToEdit.image} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Synopsis</Form.Label>
                <Form.Control as="textarea" rows={3} ref="editsynopsys" defaultValue={filmToEdit.synopsys} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Schedule</Form.Label>
                <div>{this.renderScheduleCheckboxes('edit', filmToEdit)}</div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Trailer URL (Embed)</Form.Label>
                <Form.Control type="text" ref="edittrailer" defaultValue={filmToEdit.trailer} />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Studio</Form.Label>
                <Form.Select ref="editstudioId" defaultValue={filmToEdit.studioId}>
                  {datastudio.map(studio => <option key={studio.id} value={studio.id}>{studio.nama}</option>)}
                </Form.Select>
              </Form.Group>
              <Row>
                <Col md={6}>
                   <Form.Group className="mb-3">
                    <Form.Label>Director</Form.Label>
                    <Form.Control type="text" ref="editsutradara" defaultValue={filmToEdit.sutradara} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control type="number" ref="editdurasi" defaultValue={filmToEdit.durasi} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control type="text" ref="editgenre" defaultValue={filmToEdit.genre} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Production House</Form.Label>
                    <Form.Control type="text" ref="editproduksi" defaultValue={filmToEdit.produksi} />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ modaledit: false })}>Cancel</Button>
            <Button variant="primary" onClick={this.onUpdateDataClick}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Manage Movies</h1>
          <Button variant="success" onClick={() => this.setState({ modaladd: true })}>
            <i className="fas fa-plus me-2"></i>Add New Movie
          </Button>
        </div>
        
        <Fade>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Image</th>
                <th style={{minWidth: "250px"}}>Synopsis</th>
                <th>Schedule</th>
                <th>Director</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Production</th>
                <th style={{minWidth: "120px"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataFilm.length > 0 ? this.renderMovieRows() : <tr><td colSpan="10" className="text-center">No movies found.</td></tr>}
            </tbody>
          </Table>
        </Fade>
      </Container>
    );
  }
}

const MapstateToprops = state => {
  return {
    role: state.Auth.role
  };
};

export default connect(MapstateToprops)(ManageAdmin);
