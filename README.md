# 🎬 Bioskop Sandra - Cinema Booking System

A modern, full-featured cinema booking system built with React.js and modern web technologies. This application provides a complete solution for movie theater management, ticket booking, and user management.

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.8-blue.svg)
![Redux](https://img.shields.io/badge/Redux-4.2.1-purple.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🎭 For Customers
- **Movie Browsing**: Browse current movies with detailed information
- **Movie Details**: View trailers, synopsis, cast, and showtimes
- **Seat Selection**: Interactive seat selection with real-time availability
- **Ticket Booking**: Complete booking process with multiple showtimes
- **Shopping Cart**: Add multiple tickets and manage orders
- **Order History**: View past bookings and transaction history
- **PDF Tickets**: Download tickets with QR codes and barcodes
- **User Authentication**: Secure login and registration system
- **Password Management**: Change password functionality

### 🎪 For Administrators
- **Movie Management**: Add, edit, and delete movies
- **Studio Management**: Manage cinema halls and seating arrangements
- **Schedule Management**: Set movie showtimes and availability
- **Order Tracking**: Monitor all bookings and transactions
- **User Management**: Manage customer accounts and roles

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Styling**: Beautiful UI with Tailwind CSS and Bootstrap
- **Interactive Components**: Smooth animations and transitions
- **Dark/Light Theme**: Modern gradient designs and color schemes
- **Accessibility**: WCAG compliant design patterns

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with Hooks and functional components
- **React Router 6.17.0** - Client-side routing
- **Redux 4.2.1** - State management
- **React Bootstrap 2.9.0** - UI components
- **Tailwind CSS 4.1.8** - Utility-first CSS framework
- **React Icons 4.12.0** - Icon library
- **Axios 1.6.0** - HTTP client

### Additional Libraries
- **React Responsive Carousel** - Image sliders
- **SweetAlert2** - Beautiful alerts and modals
- **jsPDF & html2canvas** - PDF generation
- **QRCode** - QR code generation
- **React Loader Spinner** - Loading indicators
- **Numeral.js** - Number formatting

### Backend API
- **JSON Server** - Mock REST API for development
- **Local Storage** - Client-side data persistence

## 📁 Project Structure

```
bioskopsandra/
├── bioskopui/                 # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Header.jsx     # Navigation header
│   │   │   ├── Footer.jsx     # Site footer
│   │   │   ├── Slider.jsx     # Image carousel
│   │   │   └── WelcomePages.jsx # Hero section
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx       # Homepage with movie listings
│   │   │   ├── MovieDetail.jsx # Movie details page
│   │   │   ├── BuyTicket.jsx  # Ticket booking page
│   │   │   ├── Cart.jsx       # Shopping cart
│   │   │   ├── Orders.jsx     # Order history
│   │   │   ├── Transactions.jsx # Transaction history
│   │   │   ├── Login.jsx      # User login
│   │   │   ├── RegisterUser.jsx # User registration
│   │   │   ├── ManageMovies.jsx # Admin movie management
│   │   │   └── ManageStudios.jsx # Admin studio management
│   │   ├── redux/             # State management
│   │   │   ├── actions/       # Redux actions
│   │   │   └── reducer/       # Redux reducers
│   │   ├── support/           # Utility files
│   │   └── utils/             # Helper functions
│   ├── public/                # Static assets
│   └── package.json           # Dependencies and scripts
├── bioskopfakeapi/            # Mock API data
│   └── db.json               # JSON database
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheFahmi/bioskopsandra.git
   cd bioskopsandra
   ```

2. **Install dependencies**
   ```bash
   cd bioskopui
   npm install
   ```

3. **Start the mock API server**
   ```bash
   # In a new terminal window
   cd bioskopfakeapi
   npx json-server --watch db.json --port 2000
   ```

4. **Start the development server**
   ```bash
   # In the bioskopui directory
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**User Account:**
- Username: `user`
- Password: `user123`

## 📱 Usage

### For Customers
1. **Browse Movies**: View current movies on the homepage
2. **View Details**: Click on any movie to see detailed information
3. **Book Tickets**: Select showtimes and seats
4. **Manage Cart**: Review and modify your selections
5. **Complete Purchase**: Finalize your booking
6. **Download Tickets**: Get PDF tickets with QR codes

### For Administrators
1. **Login as Admin**: Use admin credentials
2. **Manage Movies**: Add new movies, edit details, set schedules
3. **Manage Studios**: Configure cinema halls and seating
4. **Monitor Orders**: Track all customer bookings
5. **View Analytics**: Monitor transaction history

## 🎯 Key Features Explained

### Seat Selection System
- Interactive seat map with real-time availability
- Different seat types and pricing
- Automatic seat blocking during selection

### PDF Ticket Generation
- Professional ticket design
- QR codes for easy scanning
- Barcode integration
- Customer and movie information

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Modern animations and transitions

## 🔧 Configuration

### API Configuration
Update the API URL in `src/support/ApiUrl.js`:
```javascript
export const APIURL = 'http://localhost:2000'
```

### Styling Configuration
- **Tailwind CSS**: Configure in `tailwind.config.js`
- **Bootstrap**: Customize in component files
- **Custom CSS**: Add to `src/App.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**M Fahmi Hassan** - [@TheFahmi](https://github.com/TheFahmi)

## 🙏 Acknowledgments

- React team for the amazing framework
- Bootstrap team for the UI components
- Tailwind CSS for the utility-first approach
- All contributors and supporters

---

⭐ **Star this repository if you found it helpful!**
