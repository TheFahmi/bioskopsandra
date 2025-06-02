import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash, FaTheaterMasks, FaChair, FaEye, FaTimes } from "react-icons/fa";

class ManageStudio extends Component {
  state = {
    loading: true,
    datastudio: [],
    modaladd: false,
    modaledit: false,
    modalview: false,
    indexEdit: -1,
    idEdit: -1,
    viewStudio: null,
    formData: {
      nama: '',
      jumlahKursi: ''
    }
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
      idEdit: studioToEdit.id,
      formData: {
        nama: studioToEdit.nama,
        jumlahKursi: studioToEdit.jumlahKursi
      }
    });
  };

  handleCloseEditModal = () => {
    this.setState({
      modaledit: false,
      indexEdit: -1,
      idEdit: -1,
      formData: { nama: '', jumlahKursi: '' }
    });
  };

  handleShowViewModal = (studio) => {
    this.setState({
      modalview: true,
      viewStudio: studio
    });
  };

  handleCloseViewModal = () => {
    this.setState({
      modalview: false,
      viewStudio: null
    });
  };

  handleInputChange = (field, value) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: value
      }
    });
  };
  
  handleSaveEditStudio = () => {
    const { nama, jumlahKursi } = this.state.formData;
    const seats = parseInt(jumlahKursi);

    if (!nama || isNaN(seats) || seats <= 0) {
      return Swal.fire("Validation Error", "Studio name and a valid number of seats are required.", "error");
    }

    const updatedStudio = { nama, jumlahKursi: seats };

    Axios.put(`${APIURL}studios/${this.state.idEdit}`, updatedStudio)
      .then(() => {
        this.fetchStudios();
        this.handleCloseEditModal();
        Swal.fire("Success!", "Studio data updated successfully.", "success");
      })
      .catch(err => {
        console.log(err);
        Swal.fire("Error", "Failed to update studio data.", "error");
      });
  };

  handleShowAddModal = () => {
    this.setState({
      modaladd: true,
      formData: { nama: '', jumlahKursi: '' }
    });
  };

  handleCloseAddModal = () => {
    this.setState({
      modaladd: false,
      formData: { nama: '', jumlahKursi: '' }
    });
  };

  handleAddStudio = () => {
    const { nama, jumlahKursi } = this.state.formData;
    const seats = parseInt(jumlahKursi);

    if (!nama || isNaN(seats) || seats <= 0) {
      return Swal.fire("Validation Error", "Studio name and a valid number of seats are required.", "error");
    }

    const newStudio = { nama, jumlahKursi: seats };

    Axios.post(`${APIURL}studios`, newStudio)
      .then(() => {
        this.fetchStudios();
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

  renderStudioCards = () => {
    return this.state.datastudio.map((studio, index) => (
      <div key={studio.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <FaTheaterMasks className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {studio.nama}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <FaChair className="mr-2 text-green-500" />
                  {studio.jumlahKursi} seats
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Studio #{index + 1}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => this.handleShowViewModal(studio)}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              title="View Details"
            >
              <FaEye className="mr-1" />
              View
            </button>
            <button
              onClick={() => this.handleShowEditModal(index)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaEdit className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => this.handleDeleteStudio(studio.id, studio.nama)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <FaTrash className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    ));
  };

  renderModal = (type) => {
    const { modaladd, modaledit, modalview, formData, viewStudio } = this.state;

    if (type === 'view' && modalview && viewStudio) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Studio Details</h3>
                <button onClick={this.handleCloseViewModal} className="text-white hover:text-gray-200">
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                  <FaTheaterMasks className="text-blue-600 text-3xl" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{viewStudio.nama}</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Studio ID:</span>
                  <span className="font-semibold">#{viewStudio.id}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Number of Seats:</span>
                  <span className="font-semibold flex items-center">
                    <FaChair className="mr-2 text-green-500" />
                    {viewStudio.jumlahKursi}
                  </span>
                </div>
              </div>
              <button
                onClick={this.handleCloseViewModal}
                className="w-full mt-6 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    const isEdit = type === 'edit' && modaledit;
    const isAdd = type === 'add' && modaladd;

    if (!isEdit && !isAdd) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className={`${isEdit ? 'bg-blue-600' : 'bg-green-600'} text-white p-6 rounded-t-lg`}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {isEdit ? 'Edit Studio' : 'Add New Studio'}
              </h3>
              <button
                onClick={isEdit ? this.handleCloseEditModal : this.handleCloseAddModal}
                className="text-white hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Studio Name</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => this.handleInputChange('nama', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter studio name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Seats</label>
                <input
                  type="number"
                  value={formData.jumlahKursi}
                  onChange={(e) => this.handleInputChange('jumlahKursi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter number of seats"
                  min="1"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={isEdit ? this.handleCloseEditModal : this.handleCloseAddModal}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEdit ? this.handleSaveEditStudio : this.handleAddStudio}
                className={`flex-1 ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded-lg transition-colors`}
              >
                {isEdit ? 'Save Changes' : 'Add Studio'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { datastudio, loading } = this.state;

    if (this.props.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <FaTheaterMasks className="inline mr-3 text-blue-600" />
                Manage Studios
              </h1>
              <p className="text-gray-600">Manage cinema studios and seating arrangements</p>
            </div>
            <button
              onClick={this.handleShowAddModal}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FaPlus className="mr-2" />
              Add New Studio
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {datastudio.length}
              </div>
              <div className="text-gray-600">Total Studios</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {datastudio.reduce((total, studio) => total + (parseInt(studio.jumlahKursi) || 0), 0)}
              </div>
              <div className="text-gray-600">Total Seats</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {datastudio.length > 0 ? Math.round(datastudio.reduce((total, studio) => total + (parseInt(studio.jumlahKursi) || 0), 0) / datastudio.length) : 0}
              </div>
              <div className="text-gray-600">Avg Seats/Studio</div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading studios...</p>
            </div>
          ) : datastudio.length === 0 ? (
            <div className="text-center py-12">
              <FaTheaterMasks className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No studios found</h3>
              <p className="text-gray-500 mb-6">Create your first studio to get started.</p>
              <button
                onClick={this.handleShowAddModal}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add First Studio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {this.renderStudioCards()}
            </div>
          )}

          {/* Modals */}
          {this.renderModal('add')}
          {this.renderModal('edit')}
          {this.renderModal('view')}
        </div>
      </div>
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

export default connect(MapstateToprops)(ManageStudio);
