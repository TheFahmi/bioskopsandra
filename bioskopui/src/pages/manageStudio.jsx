import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Modal, Button, Form, Container, Spinner, Alert } from "react-bootstrap"; // React-Bootstrap imports
import Fade from "react-reveal/Fade"; // Kept as is
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";

class Managestudio extends Component {
  state = {
    loading: true,
    datastudio: [],
    modaladd: false,
    modaledit: false,
    indexEdit: -1, // Stores index of the studio being edited
    idEdit: -1     // Stores ID of the studio being edited
  };

  componentDidMount() {
    this.fetchStudios();
  }

  fetchStudios = () => {
    this.setState({ loading: true });
    Axios.get(`${APIURL}studios`)
      .then(res => {
        this.setState({ datastudio: res.data, loading: false });
      })
      .catch(err => {
         // console.log(err);
        this.setState({ loading: false });
        Swal.fire("Error", "Failed to fetch studio data.", "error");
      });
  }

  handleShowEditModal = (index) => {
    const studioToEdit = this.state.datastudio[index];
    this.setState({ 
      indexEdit: index, 
      modaledit: true, 
      idEdit: studioToEdit.id // Correctly get ID of studio to edit
    });
  };

  handleCloseEditModal = () => {
    this.setState({ modaledit: false, indexEdit: -1, idEdit: -1 });
  }
  
  handleSaveEditStudio = () => {
    const nama = this.editNamaRef.value;
    const jumlahKursi = parseInt(this.editJumlahKursiRef.value);

    if (!nama || isNaN(jumlahKursi) || jumlahKursi <= 0) {
      return Swal.fire("Validation Error", "Studio name and a valid number of seats are required.", "error");
    }

    const updatedStudio = { nama, jumlahKursi };
    
    Axios.put(`${APIURL}studios/${this.state.idEdit}`, updatedStudio)
      .then(() => {
        this.fetchStudios(); // Refresh data
        this.handleCloseEditModal();
        Swal.fire("Success!", "Studio data updated successfully.", "success");
      })
      .catch(err => {
        console.log(err);
        Swal.fire("Error", "Failed to update studio data.", "error");
      });
  };

  handleShowAddModal = () => {
    this.setState({ modaladd: true });
  }

  handleCloseAddModal = () => {
    this.setState({ modaladd: false });
  }

  handleAddStudio = () => {
    const nama = this.addNamaRef.value;
    const jumlahKursi = parseInt(this.addJumlahKursiRef.value);

    if (!nama || isNaN(jumlahKursi) || jumlahKursi <= 0) {
      return Swal.fire("Validation Error", "Studio name and a valid number of seats are required.", "error");
    }
    
    const newStudio = { nama, jumlahKursi };

    Axios.post(`${APIURL}studios`, newStudio)
      .then(() => {
        this.fetchStudios(); // Refresh data
        this.handleCloseAddModal();
        Swal.fire("Success!", "New studio added successfully.", "success");
      })
      .catch(err => {
        console.log(err);
        Swal.fire("Error", "Failed to add new studio.", "error");
      });
  };

  handleDeleteStudio = (id, name) => {
    Swal.fire({
      title: `Are you sure you want to delete ${name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(result => {
      if (result.value) {
        Axios.delete(`${APIURL}studios/${id}`)
          .then(() => {
            this.fetchStudios(); // Refresh data
            Swal.fire("Deleted!", `${name} has been deleted.`, "success");
          })
          .catch(err => {
         // console.log(err);
         // console.log(err);
             // console.log(err);
            Swal.fire("Error", `Failed to delete ${name}.`, "error");
          });
      }
    });
  };

  renderStudioRows = () => {
    return this.state.datastudio.map((val, index) => (
      <tr key={val.id}>
        <td>{index + 1}</td>
        <td>{val.nama}</td>
        <td>{val.jumlahKursi}</td>
        <td>
          <Button variant="primary" size="sm" className="me-2" onClick={() => this.handleShowEditModal(index)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => this.handleDeleteStudio(val.id, val.nama)}>
            Delete
          </Button>
        </td>
      </tr>
    ));
  };

  render() {
    const { datastudio, indexEdit, modaledit, modaladd, loading } = this.state;
    const studioToEdit = indexEdit !== -1 ? datastudio[indexEdit] : {};

    if (this.props.role !== "admin") {
      return (
        <Container className="text-center mt-5">
          <Alert variant="danger">You are not authorized to view this page.</Alert>
        </Container>
      );
    }

    if (loading) {
      return (
        <Container className="text-center mt-5">
          <Spinner animation="border" variant="primary" style={{width: "3rem", height: "3rem"}} />
          <p className="mt-2">Loading studios...</p>
        </Container>
      );
    }
    
    return (
      <Container className="mt-4">
        {/* Edit Studio Modal */}
        {indexEdit !== -1 && (
          <Modal show={modaledit} onHide={this.handleCloseEditModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Studio: {studioToEdit.nama}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Studio Name</Form.Label>
                  <Form.Control type="text" defaultValue={studioToEdit.nama} ref={ref => (this.editNamaRef = ref)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Seats</Form.Label>
                  <Form.Control type="number" defaultValue={studioToEdit.jumlahKursi} ref={ref => (this.editJumlahKursiRef = ref)} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseEditModal}>Cancel</Button>
              <Button variant="primary" onClick={this.handleSaveEditStudio}>Save Changes</Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Add Studio Modal */}
        <Modal show={modaladd} onHide={this.handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Studio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Studio Name</Form.Label>
                <Form.Control type="text" placeholder="Enter studio name" ref={ref => (this.addNamaRef = ref)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Number of Seats</Form.Label>
                <Form.Control type="number" placeholder="Enter number of seats" ref={ref => (this.addJumlahKursiRef = ref)} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseAddModal}>Cancel</Button>
            <Button variant="success" onClick={this.handleAddStudio}>Add Studio</Button>
          </Modal.Footer>
        </Modal>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Manage Studios</h1>
          <Button variant="success" onClick={this.handleShowAddModal}>
             <i className="fas fa-plus me-2"></i>Add New Studio
          </Button>
        </div>

        <Fade>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Number of Seats</th>
                <th style={{minWidth: "120px"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datastudio.length > 0 ? this.renderStudioRows() : <tr><td colSpan="4" className="text-center">No studios found.</td></tr>}
            </tbody>
          </Table>
        </Fade>
      </Container>
    );
  }
}

const MapstateToprops = state => {
  return {
    // AuthLog: state.Auth.login, // Not used
    // userId: state.Auth.id, // Not used
    role: state.Auth.role
  };
};

export default connect(MapstateToprops)(Managestudio);
