import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFilm,
  FaTicketAlt,
  FaHeart,
  FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                <FaFilm className="mr-3 text-red-700" size={24} />
                Bioskop Sandra
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Pengalaman menonton film terbaik dengan teknologi terdepan,
                kenyamanan maksimal, dan layanan berkualitas tinggi.
                Nikmati film favorit Anda bersama keluarga dan teman-teman.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="text-white font-semibold mb-4">Ikuti Kami</h5>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaFacebookF className="text-white" size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaTwitter className="text-white" size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaInstagram className="text-white" size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaYoutube className="text-white" size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold mb-4">Menu Utama</h5>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm"
                >
                  <FaFilm className="mr-3 text-red-700" size={14} />
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm"
                >
                  <FaTicketAlt className="mr-3 text-red-700" size={14} />
                  Keranjang
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm"
                >
                  <FaTicketAlt className="mr-3 text-red-700" size={14} />
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link
                  to="/transactions"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center text-sm"
                >
                  <FaTicketAlt className="mr-3 text-red-700" size={14} />
                  Riwayat Transaksi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-white font-semibold mb-4">Kontak Kami</h5>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-red-700 flex-shrink-0" size={14} />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Jl. Cinema Boulevard No. 123<br />
                  Jakarta Selatan, 12345
                </span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-3 text-red-700 flex-shrink-0" size={14} />
                <span className="text-gray-400 text-sm">
                  +62 21 1234 5678
                </span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-3 text-red-700 flex-shrink-0" size={14} />
                <span className="text-gray-400 text-sm">
                  info@bioskopsandra.com
                </span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h5 className="text-white font-semibold mb-4">Jam Operasional</h5>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaClock className="mr-3 mt-1 text-red-700 flex-shrink-0" size={14} />
                <div className="text-gray-400 text-sm">
                  <div className="font-medium">Senin - Jumat</div>
                  <div>10:00 - 23:00</div>
                </div>
              </div>
              <div className="flex items-start">
                <FaClock className="mr-3 mt-1 text-red-700 flex-shrink-0" size={14} />
                <div className="text-gray-400 text-sm">
                  <div className="font-medium">Sabtu - Minggu</div>
                  <div>09:00 - 24:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © 2024 Bioskop Sandra. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              Made with <FaHeart className="mx-1 text-red-700" size={12} /> for movie lovers
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-red-700 hover:bg-red-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 z-50 flex items-center justify-center"
      >
        <FaArrowUp size={16} />
      </button>
    </footer>
  );
};

export default Footer;
