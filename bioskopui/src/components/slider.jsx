import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaTicketAlt, FaStar, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayInterval = useRef(null);

  const slides = [
    {
      id: 1,
      image: "https://6a25bbd04bd33b8a843e-9626a8b6c7858057941524bfdad5f5b0.ssl.cf5.rackcdn.com/styles/movie_1500x580/rcf/news/A4_horz_brandburst_1500x580.jpg?itok=4MqI9imW",
      title: "Experience IMAX",
      subtitle: "The Ultimate Cinema Technology",
      description: "Immerse yourself in crystal-clear visuals and thunderous sound that puts you right in the heart of the action.",
      cta: "Book IMAX Tickets",
      features: ["4K Resolution", "Dolby Atmos", "Giant Screen"]
    },
    {
      id: 2,
      image: "https://www.geekgeneration.fr/wp-content/uploads/2019/02/Carre.Senart.IMAX_.HD_.044-%C2%A9-Fr%C3%A9d%C3%A9ric-Berthet.jpg",
      title: "Premium Theater",
      subtitle: "Luxury Redefined",
      description: "Relax in our premium reclining seats with personal service and gourmet concessions for the perfect movie night.",
      cta: "Reserve Premium Seats",
      features: ["Luxury Seating", "Personal Service", "Gourmet Food"]
    },
    {
      id: 3,
      image: "https://cdn.celluloidjunkie.com/wp-content/uploads/2018/04/19172342/CinepolisOrlando-0010.jpg",
      title: "Bioskop Sandra",
      subtitle: "Your Cinema Destination",
      description: "Welcome to the most advanced cinema complex with multiple theaters, latest movies, and unforgettable experiences.",
      cta: "Explore All Movies",
      features: ["8 Theaters", "Latest Movies", "Premium Experience"]
    }
  ];

  const startAutoPlay = () => {
    if (isAutoPlaying) {
      autoPlayInterval.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
      autoPlayInterval.current = null;
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prevSlide => prevSlide === 0 ? slides.length - 1 : prevSlide - 1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    stopAutoPlay();
  };

  const handleMouseLeave = () => {
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [isAutoPlaying]);

  const slide = slides[currentSlide];

  return (
    <div
      className="relative h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images */}
      {slides.map((slideItem, index) => (
          <div
            key={slideItem.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slideItem.image}
              alt={slideItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white space-y-6">
                <div className="space-y-4">
                  <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                    🎬 {slide.subtitle}
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                    {slide.title.split(' ').map((word, index) => (
                      <span key={index} className={index === 1 ? "block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent" : "block"}>
                        {word}
                      </span>
                    ))}
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                    {slide.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-3">
                  {slide.features.map((feature, index) => (
                    <span key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <span className="flex items-center justify-center">
                      <FaTicketAlt className="mr-2 group-hover:animate-pulse" />
                      {slide.cta}
                    </span>
                  </button>

                  <button className="group border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105">
                    <span className="flex items-center justify-center">
                      <FaPlay className="mr-2 group-hover:animate-pulse" />
                      Watch Trailer
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

              {/* Right Content - Feature Highlight */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">
                        {currentSlide === 0 ? '🎭' : currentSlide === 1 ? '🍿' : '🎬'}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {currentSlide === 0 ? 'IMAX Experience' : currentSlide === 1 ? 'Premium Comfort' : 'Latest Movies'}
                      </h3>
                      <p className="text-gray-300">
                        {currentSlide === 0 ? 'Immersive giant screen technology' : currentSlide === 1 ? 'Luxury reclining seats & service' : 'Blockbusters & indie films'}
                      </p>
                      <div className="flex items-center justify-center space-x-4 pt-4">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="text-white font-semibold">5.0</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-blue-400 mr-1" />
                          <span className="text-white">Open Daily</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
        >
          <FaChevronLeft className="text-xl" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
        >
          <FaChevronRight className="text-xl" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-yellow-400 w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
};

export default Slider;
