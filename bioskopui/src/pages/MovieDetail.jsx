import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/ApiUrl';
import { connect } from 'react-redux';
import { Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaPlay, FaClock, FaUser, FaStar, FaTicketAlt, FaCalendar, FaFilm, FaHeart, FaShare, FaTimes } from 'react-icons/fa';

const MovieDetail = (props) => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [datadetailfilm, setDatadetailfilm] = useState(null);
    const [traileropen, setTraileropen] = useState(false);
    const [notloginyet, setNotloginyet] = useState(false);
    const [kelogin, setKelogin] = useState(false);
    const [buyTicketOk, setBuyTicketOk] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const movieId = params.id;
        if (!movieId) {
            setError("ID Film tidak valid");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        const url = `${APIURL}/movies/${movieId}`;
        console.log('Fetching movie from URL:', url);

        Axios.get(url)
            .then(res => {
                console.log('Movie data received:', res.data);
                if (res.data) {
                    setDatadetailfilm(res.data);
                    setLoading(false);
                } else {
                    setError("Film tidak ditemukan");
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error('Error fetching movie:', err);
                if (err.response) {
                    console.error('Error response:', err.response);
                    setError(`Error ${err.response.status}: ${err.response.statusText}`);
                    setLoading(false);
                } else if (err.request) {
                    console.error('No response received:', err.request);
                    setError("Tidak dapat terhubung ke server. Silakan periksa koneksi Anda.");
                    setLoading(false);
                } else {
                    console.error('Error setting up request:', err.message);
                    setError("Terjadi kesalahan. Silakan coba lagi.");
                    setLoading(false);
                }
            });
    }, [params.id]);

    const onBuyTicketClick = () => {
        if (props.AuthLog) {
            setBuyTicketOk(true);
        } else {
            setNotloginyet(true);
        }
    };

    const handleCloseNotLoginYetModal = () => {
        setNotloginyet(false);
    };

    const handleRedirectToLogin = () => {
        setNotloginyet(false);
        setKelogin(true);
    };

    if (kelogin) {
        // Pass movie details to login, so it can redirect back or use data after login
        return <Navigate to="/login" state={{ from: location, movieDetails: datadetailfilm }} replace />;
    }
    if (buyTicketOk) {
        return <Navigate to="/buy-ticket" state={datadetailfilm} replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading movie details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!datadetailfilm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-4">
                    <div className="text-center">
                        <p className="text-yellow-800">Movie data not available.</p>
                    </div>
                </div>
            </div>
        );
    }

    const { title, image, trailer, synopsys, genre, durasi, sutradara, cast } = datadetailfilm;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Trailer Modal */}
            {traileropen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{title} - Trailer</h3>
                            <button
                                onClick={() => setTraileropen(false)}
                                className="text-white hover:text-gray-300 text-xl"
                            >
                                <FaTimes />
                            </button>
                        </div>
                            <div className="relative" style={{ height: '70vh' }}>
                                {trailer && (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        title={title}
                                        src={trailer.replace("watch?v=", "embed/")}
                                        className="border-0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            {/* Not Login Yet Modal */}
            {notloginyet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Authentication Required</h3>
                                <button
                                    onClick={handleCloseNotLoginYetModal}
                                    className="text-white hover:text-gray-200 text-xl"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-6">You need to login first to buy tickets.</p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCloseNotLoginYetModal}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRedirectToLogin}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

                {/* Hero Section with Movie Backdrop */}
                <div className="relative h-screen">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
                    </div>

                    {/* Content */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                            {/* Movie Poster */}
                            <div className="flex justify-center lg:justify-start">
                                <div className="relative group">
                                    <img
                                        src={image}
                                        alt={title}
                                        className="w-80 h-[480px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Rating Badge */}
                                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold flex items-center">
                                        <FaStar className="mr-1" />
                                        8.5
                                    </div>
                                </div>
                            </div>

                            {/* Movie Info */}
                            <div className="text-white space-y-6">
                                <div>
                                    <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                                        {title}
                                    </h1>
                                    <div className="flex items-center space-x-6 text-lg text-gray-300 mb-6">
                                        <div className="flex items-center">
                                            <FaClock className="mr-2 text-blue-400" />
                                            {durasi} min
                                        </div>
                                        <div className="flex items-center">
                                            <FaFilm className="mr-2 text-purple-400" />
                                            {genre}
                                        </div>
                                        <div className="flex items-center">
                                            <FaUser className="mr-2 text-green-400" />
                                            {sutradara}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                                    {synopsys}
                                </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onBuyTicketClick}
                                    className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                                >
                                    <span className="flex items-center justify-center">
                                        <FaTicketAlt className="mr-2 group-hover:animate-pulse" />
                                        Buy Tickets
                                    </span>
                                </button>

                                {trailer && (
                                    <button
                                        onClick={() => setTraileropen(true)}
                                        className="group border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105"
                                    >
                                        <span className="flex items-center justify-center">
                                            <FaPlay className="mr-2 group-hover:animate-pulse" />
                                            Watch Trailer
                                        </span>
                                    </button>
                                )}

                                    <button className="group border-2 border-white/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300">
                                        <FaHeart className="group-hover:text-red-400 transition-colors duration-300" />
                                    </button>

                                    <button className="group border-2 border-white/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300">
                                        <FaShare className="group-hover:text-blue-400 transition-colors duration-300" />
                                    </button>
                                </div>

                                {/* Additional Info */}
                                {cast && (
                                    <div className="pt-6 border-t border-white/20">
                                        <h3 className="text-xl font-semibold mb-2">Cast</h3>
                                        <p className="text-gray-300">{cast}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Movie Details Section */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Movie Details</h2>
                            <p className="text-lg text-gray-600">Everything you need to know about this movie</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <FaClock className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Duration</h3>
                                <p className="text-gray-600">{durasi} minutes</p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <FaFilm className="text-purple-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Genre</h3>
                                <p className="text-gray-600">{genre}</p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <FaUser className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Director</h3>
                                <p className="text-gray-600">{sutradara}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

const MapstateToprops = (state) => {
    return {
      AuthLog: state.Auth.login
    }
}
export default connect(MapstateToprops)(MovieDetail);
