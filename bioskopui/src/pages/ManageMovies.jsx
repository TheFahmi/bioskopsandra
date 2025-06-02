import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { connect } from "react-redux";
import { FaPlus, FaEdit, FaTrash, FaFilm, FaEye, FaTimes, FaClock, FaPlay, FaTheaterMasks, FaUser } from "react-icons/fa";

const Myswal = withReactContent(Swal);

const ManageMovies = (props) => {
  const [dataFilm, setDataFilm] = useState([]);
  const [modaladd, setModaladd] = useState(false);
  const [modaledit, setModaledit] = useState(false);
  const [modalview, setModalview] = useState(false);
  const [indexedit, setIndexedit] = useState(0);
  const [jadwal] = useState([12, 14, 16, 18, 20, 22]);
  const [datastudio, setDatastudio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readmoreselected, setReadmoreselected] = useState(-1);
  const [viewMovie, setViewMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    synopsys: '',
    sutradara: '',
    genre: '',
    durasi: '',
    jadwal: [],
    produksi: '',
    trailer: '',
    studioId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Axios.get(`${APIURL}movies`)
      .then(resMovies => {
        Axios.get(`${APIURL}studios`)
          .then(resStudios => {
            setDataFilm(resMovies.data);
            setDatastudio(resStudios.data);
            setLoading(false);
          })
          .catch(errStudios => {
            console.log(errStudios);
            setLoading(false);
            Myswal.fire("Error", "Failed to fetch studio data.", "error");
          });
      })
      .catch(errMovies => {
             // console.log(errStudios);
         // console.log(errMovies);
        setLoading(false);
        Myswal.fire("Error", "Failed to fetch movie data.", "error");
      });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleScheduleChange = (time, checked) => {
    let newSchedule = [...formData.jadwal];

    if (checked) {
      if (!newSchedule.includes(time)) {
        newSchedule.push(time);
      }
    } else {
      newSchedule = newSchedule.filter(t => t !== time);
    }

    setFormData({
      ...formData,
      jadwal: newSchedule
    });
  };

  const handleShowAddModal = () => {
    setModaladd(true);
    setFormData({
      title: '',
      image: '',
      synopsys: '',
      sutradara: '',
      genre: '',
      durasi: '',
      jadwal: [],
      produksi: '',
      trailer: '',
      studioId: datastudio.length > 0 ? datastudio[0].id : ''
    });
  };

  const handleCloseAddModal = () => {
    setModaladd(false);
    setFormData({
      title: '',
      image: '',
      synopsys: '',
      sutradara: '',
      genre: '',
      durasi: '',
      jadwal: [],
      produksi: '',
      trailer: '',
      studioId: ''
    });
  };

  const handleShowEditModal = (index) => {
    const movie = dataFilm[index];
    setModaledit(true);
    setIndexedit(index);
    setFormData({
      title: movie.title || '',
      image: movie.image || '',
      synopsys: movie.synopsys || '',
      sutradara: movie.sutradara || '',
      genre: movie.genre || '',
      durasi: movie.durasi || '',
      jadwal: movie.jadwal || [],
      produksi: movie.produksi || '',
      trailer: movie.trailer || '',
      studioId: movie.studioId || ''
    });
  };

  const handleCloseEditModal = () => {
    setModaledit(false);
    setIndexedit(0);
    setFormData({
      title: '',
      image: '',
      synopsys: '',
      sutradara: '',
      genre: '',
      durasi: '',
      jadwal: [],
      produksi: '',
      trailer: '',
      studioId: ''
    });
  };

  const handleShowViewModal = (movie) => {
    setModalview(true);
    setViewMovie(movie);
  };

  const handleCloseViewModal = () => {
    setModalview(false);
    setViewMovie(null);
  };

  const onUpdateDataClick = () => {
    const currentFilm = dataFilm[indexedit];

    if (!formData.title || !formData.image || !formData.synopsys || !formData.sutradara ||
        !formData.genre || !formData.durasi || !formData.produksi || !formData.trailer ||
        !formData.studioId || formData.jadwal.length === 0) {
      return Myswal.fire("Validation Error", "All fields must be filled, and schedule/studio must be selected.", "error");
    }

    const updatedData = {
      ...formData,
      durasi: parseInt(formData.durasi) || 0,
      studioId: parseInt(formData.studioId)
    };

    Axios.patch(`${APIURL}movies/${currentFilm.id}`, updatedData)
      .then(() => {
        fetchData();
        handleCloseEditModal();
        Myswal.fire("Success!", "Movie data updated successfully.", "success");
      })
      .catch(err => {
        console.log(err);
        Myswal.fire("Error", "Failed to update movie data.", "error");
      });
  };

  const onSaveDataClick = () => {
    if (!formData.title || !formData.image || !formData.synopsys || !formData.sutradara ||
        !formData.genre || !formData.durasi || !formData.produksi || !formData.trailer ||
        !formData.studioId || formData.jadwal.length === 0) {
      return Myswal.fire("Validation Error", "All fields must be filled, and schedule/studio must be selected.", "error");
    }

    const newData = {
      ...formData,
      durasi: parseInt(formData.durasi) || 0,
      studioId: parseInt(formData.studioId)
    };

    Axios.post(`${APIURL}movies`, newData)
      .then(() => {
        fetchData();
        handleCloseAddModal();
        Myswal.fire("Success!", "New movie added successfully.", "success");
      })
      .catch(err => {
        console.log(err);
        Myswal.fire("Error", "Failed to add new movie.", "error");
      });
  };

  const deleteMovie = (id, title) => {
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
            fetchData(); // Refresh data
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

  const renderMovieCards = () => {
    return dataFilm.map((movie, index) => (
      <div key={movie.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                {movie.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaUser className="mr-2 text-blue-500" />
                  <span className="font-medium">Director:</span>
                  <span className="ml-1">{movie.sutradara}</span>
                </div>

                <div className="flex items-center">
                  <FaFilm className="mr-2 text-purple-500" />
                  <span className="font-medium">Genre:</span>
                  <span className="ml-1">{movie.genre}</span>
                </div>

                <div className="flex items-center">
                  <FaClock className="mr-2 text-green-500" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-1">{movie.durasi} minutes</span>
                </div>

                <div className="flex items-center">
                  <FaTheaterMasks className="mr-2 text-orange-500" />
                  <span className="font-medium">Production:</span>
                  <span className="ml-1">{movie.produksi}</span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mt-3">
                <p className="text-sm text-gray-700">
                  {movie.synopsys.length <= 100 ? movie.synopsys :
                    readmoreselected === index ? (
                      <>
                        {movie.synopsys}
                        <button
                          onClick={() => setReadmoreselected(-1)}
                          className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read less
                        </button>
                      </>
                    ) : (
                      <>
                        {movie.synopsys.substring(0, 100)}...
                        <button
                          onClick={() => setReadmoreselected(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read more
                        </button>
                      </>
                    )
                  }
                </p>
              </div>

              {/* Schedule */}
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {movie.jadwal.map(time => (
                    <span key={time} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      <FaClock className="inline mr-1" />
                      {time}:00
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleShowViewModal(movie)}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              title="View Details"
            >
              <FaEye className="mr-1" />
              View
            </button>
            <button
              onClick={() => handleShowEditModal(index)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaEdit className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => deleteMovie(movie.id, movie.title)}
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

  const renderScheduleCheckboxes = () => {
    const scheduleTemplate = jadwal;

    return (
      <div className="grid grid-cols-3 gap-3">
        {scheduleTemplate.map((time) => (
          <label key={time} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.jadwal.includes(time)}
              onChange={(e) => handleScheduleChange(time, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">{time}:00</span>
          </label>
        ))}
      </div>
    );
  };


  const renderModal = (type) => {
    if (type === 'view' && modalview && viewMovie) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Movie Details</h3>
                <button onClick={handleCloseViewModal} className="text-white hover:text-gray-200">
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-6 mb-6">
                <img
                  src={viewMovie.image}
                  alt={viewMovie.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">{viewMovie.title}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Director:</span> {viewMovie.sutradara}</div>
                    <div><span className="font-semibold">Genre:</span> {viewMovie.genre}</div>
                    <div><span className="font-semibold">Duration:</span> {viewMovie.durasi} minutes</div>
                    <div><span className="font-semibold">Production:</span> {viewMovie.produksi}</div>
                  </div>
                  <div className="mt-4">
                    <span className="font-semibold">Schedule:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {viewMovie.jadwal.map(time => (
                        <span key={time} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {time}:00
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Synopsis:</span>
                <p className="mt-2 text-gray-700">{viewMovie.synopsys}</p>
              </div>
              <button
                onClick={handleCloseViewModal}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
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
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className={`${isEdit ? 'bg-blue-600' : 'bg-green-600'} text-white p-6 rounded-t-lg`}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {isEdit ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button
                onClick={isEdit ? handleCloseEditModal : handleCloseAddModal}
                className="text-white hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter movie title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Synopsis</label>
                <textarea
                  value={formData.synopsys}
                  onChange={(e) => handleInputChange('synopsys', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter movie synopsis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Director</label>
                <input
                  type="text"
                  value={formData.sutradara}
                  onChange={(e) => handleInputChange('sutradara', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter director name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter movie genre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.durasi}
                  onChange={(e) => handleInputChange('durasi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter duration"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Production</label>
                <input
                  type="text"
                  value={formData.produksi}
                  onChange={(e) => handleInputChange('produksi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter production company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trailer URL</label>
                <input
                  type="text"
                  value={formData.trailer}
                  onChange={(e) => handleInputChange('trailer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter trailer URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Studio</label>
                <select
                  value={formData.studioId}
                  onChange={(e) => handleInputChange('studioId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Studio</option>
                  {datastudio.map(studio => (
                    <option key={studio.id} value={studio.id}>{studio.nama}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                {renderScheduleCheckboxes()}
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={isEdit ? handleCloseEditModal : handleCloseAddModal}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEdit ? onUpdateDataClick : onSaveDataClick}
                className={`flex-1 ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded-lg transition-colors`}
              >
                {isEdit ? 'Save Changes' : 'Add Movie'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (props.role !== "admin") {
    return <Navigate to="/" replace />;
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <FaFilm className="inline mr-3 text-purple-600" />
                Manage Movies
              </h1>
              <p className="text-gray-600">Manage cinema movies and showtimes</p>
            </div>
            <button
              onClick={handleShowAddModal}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FaPlus className="mr-2" />
              Add New Movie
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {dataFilm.length}
              </div>
              <div className="text-gray-600">Total Movies</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {dataFilm.reduce((total, movie) => total + (movie.jadwal?.length || 0), 0)}
              </div>
              <div className="text-gray-600">Total Showtimes</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {new Set(dataFilm.map(movie => movie.genre)).size}
              </div>
              <div className="text-gray-600">Genres</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {dataFilm.length > 0 ? Math.round(dataFilm.reduce((total, movie) => total + (parseInt(movie.durasi) || 0), 0) / dataFilm.length) : 0}
              </div>
              <div className="text-gray-600">Avg Duration (min)</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {datastudio.reduce((total, studio) => total + (parseInt(studio.jumlahKursi) || 0), 0)}
              </div>
              <div className="text-gray-600">Total Seats</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {datastudio.length > 0 ? Math.round(datastudio.reduce((total, studio) => total + (parseInt(studio.jumlahKursi) || 0), 0) / datastudio.length) : 0}
              </div>
              <div className="text-gray-600">Avg Seats/Studio</div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading movies...</p>
            </div>
          ) : dataFilm.length === 0 ? (
            <div className="text-center py-12">
              <FaFilm className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No movies found</h3>
              <p className="text-gray-500 mb-6">Add your first movie to get started.</p>
              <button
                onClick={this.handleShowAddModal}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add First Movie
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderMovieCards()}
            </div>
          )}

          {/* Modals */}
          {renderModal('add')}
          {renderModal('edit')}
          {renderModal('view')}
        </div>
      </div>
    );
};

const MapstateToprops = state => {
  return {
    role: state.Auth.role
  };
};

export default connect(MapstateToprops)(ManageMovies);
