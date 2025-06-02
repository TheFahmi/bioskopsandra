import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { FaPlay, FaClock, FaUser, FaStar, FaEye, FaCalendar } from "react-icons/fa";

const API_URL = "http://localhost:2000";

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
        <div key={movie.id} className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          {/* Movie Poster */}
          <div className="relative overflow-hidden">
            <Link to={`/moviedetail/${movie.id}`}>
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <FaPlay className="text-white text-2xl" />
                </div>
              </div>
            </Link>

            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold flex items-center">
              <FaStar className="mr-1" />
              8.5
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {movie.title}
            </h3>

            {/* Movie Details */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <FaClock className="mr-1" />
                {movie.durasi}m
              </div>
              <div className="flex items-center">
                <FaUser className="mr-1" />
                {movie.genre}
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {synopsisToShow}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => this.toggleReadMore(movie.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <FaEye className="inline mr-2" />
                {isReadMore ? "Show Less" : "Read More"}
              </button>
              <Link
                to={`/moviedetail/${movie.id}`}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 py-2 px-4 rounded-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 text-sm font-medium"
              >
                View Details
              </Link>
            </div>

            {/* Extended Info */}
            {isReadMore && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Director:</span>
                  {movie.sutradara}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendar className="mr-2" />
                  <span className="font-medium mr-2">Showtimes:</span>
                  {movie.jadwal && movie.jadwal.map((time, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 text-xs">
                      {time}:00
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{this.state.error}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">{/* Removed min-h-screen since this is no longer the main hero */}

        {/* Movies Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Now Showing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest movies and book your tickets for an unforgettable experience
            </p>
          </div>

          {this.state.dataMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {this.renderMovies()}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 7v10a2 2 0 002 2h14a2 2 0 002-2V7H3z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No movies available</h3>
                <p className="mt-2 text-gray-500">Check back later for new releases and showtimes.</p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Bioskop Sandra?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaPlay className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Latest Technology</h3>
                <p className="text-gray-600">Experience movies with state-of-the-art sound and projection systems</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-yellow-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Experience</h3>
                <p className="text-gray-600">Comfortable seating and premium amenities for the perfect movie night</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-green-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Showtimes</h3>
                <p className="text-gray-600">Multiple showtimes throughout the day to fit your schedule</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
