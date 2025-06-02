# 🎬 Bioskop Sandra - Frontend Application

This is the frontend React application for the Bioskop Sandra cinema booking system. Built with modern React 18, Redux for state management, and styled with Tailwind CSS and Bootstrap.

## 🛠️ Technology Stack

- **React 18.2.0** - Modern React with Hooks
- **Redux 4.2.1** - State management
- **React Router 6.17.0** - Client-side routing
- **Bootstrap 5.3.0** - UI components
- **Tailwind CSS 4.1.8** - Utility-first CSS
- **Axios 1.6.0** - HTTP client
- **React Icons 4.12.0** - Icon library

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header with auth
│   ├── Footer.jsx      # Site footer
│   ├── Slider.jsx      # Image carousel
│   └── WelcomePages.jsx # Hero section
├── pages/              # Page components
│   ├── Home.jsx        # Movie listings
│   ├── MovieDetail.jsx # Movie details
│   ├── BuyTicket.jsx   # Ticket booking
│   ├── Cart.jsx        # Shopping cart
│   ├── Orders.jsx      # Order history
│   ├── Transactions.jsx # Transaction history
│   ├── Login.jsx       # Authentication
│   ├── ManageMovies.jsx # Admin movie management
│   └── ManageStudios.jsx # Admin studio management
├── redux/              # State management
│   ├── actions/        # Redux actions
│   └── reducer/        # Redux reducers
├── support/            # Utility files
└── utils/              # Helper functions
```

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
The page will reload when you make edits and show lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for best performance.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time.

## 🎯 Key Features

### User Features
- **Movie Browsing**: Browse current movies with detailed information
- **Seat Selection**: Interactive seat selection with real-time availability
- **Ticket Booking**: Complete booking process with multiple showtimes
- **Shopping Cart**: Add multiple tickets and manage orders
- **PDF Tickets**: Download tickets with QR codes and barcodes
- **Order History**: View past bookings and transaction history

### Admin Features
- **Movie Management**: Add, edit, and delete movies
- **Studio Management**: Manage cinema halls and seating arrangements
- **Schedule Management**: Set movie showtimes and availability
- **Order Tracking**: Monitor all bookings and transactions

## 🎨 UI Components

### Modern Design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Bootstrap Components**: Pre-built UI components
- **React Icons**: Beautiful icon library
- **Smooth Animations**: Modern transitions and effects

### Component Architecture
- **Functional Components**: Modern React with Hooks
- **Redux State Management**: Centralized state management
- **React Router**: Client-side routing
- **Modular Design**: Reusable and maintainable components

## 🔧 Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Build for production: `npm run build`

### Code Style
- **PascalCase**: Component names follow PascalCase convention
- **Functional Components**: Prefer function components over class components
- **Modern React**: Uses React Hooks and modern patterns
- **ESLint**: Code linting for consistency

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all functionality
- **Tablet**: Touch-optimized interface with adapted layouts
- **Mobile**: Mobile-first design with optimized navigation

## 🔐 Authentication

- **User Registration**: New user account creation
- **Login System**: Secure user authentication
- **Role-based Access**: Different features for users and admins
- **Password Management**: Change password functionality
- **Session Management**: Persistent login state

## 📊 State Management

Uses Redux for centralized state management:
- **Auth State**: User authentication and session data
- **Cart State**: Shopping cart and order management
- **Movie State**: Movie data and selections
- **UI State**: Loading states and notifications

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For more information about Create React App, check out the [documentation](https://facebook.github.io/create-react-app/docs/getting-started).
