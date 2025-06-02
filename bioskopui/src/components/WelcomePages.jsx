import React from "react";
import { FaPlay, FaTicketAlt, FaStar, FaClock } from "react-icons/fa";

const WelcomePages = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-pink-400/10 to-red-400/10 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-bounce">
                🎬 Premium Cinema Experience
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                Bioskop Sandra
              </span>
              <span className="block text-4xl md:text-6xl text-blue-200">
                Cinema Paradise
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Step into a world where stories come alive on the big screen. Experience the latest blockbusters,
              timeless classics, and indie gems in our state-of-the-art theaters with premium comfort,
              crystal-clear visuals, and immersive surround sound that will transport you to another dimension.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <span className="flex items-center justify-center">
                  <FaTicketAlt className="mr-2 group-hover:animate-pulse" />
                  Book Your Tickets
                </span>
              </button>
              <button className="group border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center justify-center">
                  <FaPlay className="mr-2 group-hover:animate-pulse" />
                  Watch Trailers
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">50+</div>
                <div className="text-sm text-gray-400">Movies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">8</div>
                <div className="text-sm text-gray-400">Theaters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">1M+</div>
                <div className="text-sm text-gray-400">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Cinema Visual */}
          <div className="relative">
            <div className="relative group">
              {/* Main Cinema Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <img
                  src="https://mediafiles.cinema.com.hk/broadway/cmsimg/cinweb/webcms/images/4e046e519a547af95b0b46ddd49a882c_1564395125.jpg"
                  alt="Cinema Experience"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 transform group-hover:scale-110 transition-transform duration-300">
                    <FaPlay className="text-white text-4xl" />
                  </div>
                </div>

                {/* Cinema Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Premium Theater Experience</h3>
                  <p className="text-gray-300 text-sm mb-3">4K • Dolby Atmos • Luxury Seating</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-white font-semibold">5.0</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-blue-400 mr-1" />
                      <span className="text-white">Open 24/7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-yellow-400 text-2xl mb-1">🎭</div>
                <div className="text-white font-bold">IMAX</div>
                <div className="text-gray-300 text-sm">Experience</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-blue-400 text-2xl mb-1">🍿</div>
                <div className="text-white font-bold">Premium</div>
                <div className="text-gray-300 text-sm">Concessions</div>
              </div>
            </div>
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
  );
};

export default WelcomePages;