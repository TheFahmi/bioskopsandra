import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateTicketPDF = async (order) => {
  const movie = order.movie || {};
  const orderDetails = order.orderDetails || [];
  const seats = orderDetails.map(seat =>
    `${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seat.row]}${seat.seat + 1}`
  ).join(', ');

  // Create new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set font
  pdf.setFont('helvetica');

  // Colors
  const primaryColor = '#1e40af'; // Blue
  const secondaryColor = '#6b7280'; // Gray
  const accentColor = '#dc2626'; // Red

  // Header
  pdf.setFillColor(30, 64, 175); // Primary blue
  pdf.rect(0, 0, 210, 40, 'F');
  
  // Cinema logo/name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BIOSKOP SANDRA', 20, 20);

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('CINEMA EXPERIENCE', 20, 30);

  // Ticket title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MOVIE TICKET', 20, 60);

  // Ticket border
  pdf.setDrawColor(30, 64, 175);
  pdf.setLineWidth(2);
  pdf.rect(15, 45, 180, 200);

  // Movie information section
  let yPos = 80;
  
  // Movie title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('MOVIE:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.text(movie.title || 'N/A', 50, yPos);

  yPos += 15;

  // Genre
  pdf.setFontSize(12);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Genre:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.text(movie.genre || 'N/A', 50, yPos);

  yPos += 10;

  // Duration
  pdf.setTextColor(107, 114, 128);
  pdf.text('Duration:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${movie.durasi || 'N/A'} minutes`, 50, yPos);
  
  yPos += 20;

  // Booking details section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('BOOKING DETAILS', 20, yPos);
  
  yPos += 15;
  
  // Order ID
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Order ID:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`#${order.id}`, 50, yPos);

  yPos += 10;

  // Showtime
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Showtime:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${order.jadwal}:00`, 50, yPos);

  yPos += 10;

  // Seats
  pdf.setTextColor(107, 114, 128);
  pdf.text('Seats:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(seats, 50, yPos);

  yPos += 10;

  // Customer name (if available)
  if (order.customerName) {
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text('Customer:', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    pdf.text(order.customerName, 50, yPos);
    yPos += 10;
  }

  // Total price
  pdf.setTextColor(107, 114, 128);
  pdf.text('Total:', 20, yPos);
  pdf.setTextColor(220, 38, 38); // Red color for price
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  const totalPrice = order.totalharga || order.totalHarga || 0;
  pdf.text(`Rp ${totalPrice.toLocaleString('id-ID')}`, 50, yPos);

  yPos += 15;

  // Status
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Status:', 20, yPos);

  if (order.bayar) {
    pdf.setTextColor(34, 197, 94); // Green
    pdf.text('PAID', 50, yPos);
  } else {
    pdf.setTextColor(245, 158, 11); // Yellow
    pdf.text('PENDING', 50, yPos);
  }

  yPos += 15;

  // Order date
  pdf.setTextColor(107, 114, 128);
  pdf.text('Order Date:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleString('id-ID') : 'N/A';
  pdf.text(orderDate, 50, yPos);

  // Generate QR Code
  const qrData = JSON.stringify({
    orderId: order.id,
    movieTitle: movie.title,
    showtime: `${order.jadwal}:00`,
    seats: seats,
    total: totalPrice,
    status: order.bayar ? 'PAID' : 'PENDING'
  });

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 100,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Add QR code to PDF
    pdf.addImage(qrCodeDataURL, 'PNG', 140, 120, 40, 40);
    
    // QR code label
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text('Scan for verification', 145, 170);
    
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  yPos = 220;
  pdf.setFillColor(248, 250, 252); // Light gray background
  pdf.rect(15, yPos, 180, 25, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Please arrive 15 minutes before showtime', 20, yPos + 8);
  pdf.text('Present this ticket at the entrance', 20, yPos + 16);
  pdf.text('Thank you for choosing Bioskop Sandra!', 20, yPos + 24);

  // Save the PDF
  const fileName = `BioskopSandra_Ticket_${order.id}.pdf`;
  pdf.save(fileName);
};

export const generateReceiptPDF = async (transaction) => {
  const movie = transaction.movie || {};
  const orderDetails = transaction.orderDetails || [];
  const seats = orderDetails.map(seat =>
    `${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seat.row]}${seat.seat + 1}`
  ).join(', ');

  // Create new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set font
  pdf.setFont('helvetica');

  // Colors
  const primaryColor = '#059669'; // Green
  const secondaryColor = '#6b7280'; // Gray
  const accentColor = '#dc2626'; // Red

  // Header
  pdf.setFillColor(5, 150, 105); // Primary green
  pdf.rect(0, 0, 210, 40, 'F');

  // Cinema logo/name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BIOSKOP SANDRA', 20, 20);

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('PAYMENT RECEIPT', 20, 30);

  // Receipt title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT RECEIPT', 20, 60);

  // Receipt border
  pdf.setDrawColor(5, 150, 105);
  pdf.setLineWidth(2);
  pdf.rect(15, 45, 180, 200);

  // Transaction information section
  let yPos = 80;

  // Transaction ID
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(5, 150, 105);
  pdf.text('TRANSACTION DETAILS', 20, yPos);

  yPos += 15;

  // Transaction ID
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Transaction ID:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`#${transaction.id}`, 70, yPos);

  yPos += 10;

  // Transaction date
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Date:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  const transactionDate = transaction.orderDate ? new Date(transaction.orderDate).toLocaleString('id-ID') : 'N/A';
  pdf.text(transactionDate, 70, yPos);

  yPos += 10;

  // Payment method
  pdf.setTextColor(107, 114, 128);
  pdf.text('Payment Method:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  const paymentMethod = transaction.paymentMethod === 'credit_card' ? 'Credit Card' :
                       transaction.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                       transaction.paymentMethod || 'N/A';
  pdf.text(paymentMethod, 70, yPos);

  yPos += 20;

  // Movie information section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(5, 150, 105);
  pdf.text('MOVIE DETAILS', 20, yPos);

  yPos += 15;

  // Movie title
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Movie:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(movie.title || 'N/A', 70, yPos);

  yPos += 10;

  // Genre
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Genre:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.text(movie.genre || 'N/A', 70, yPos);

  yPos += 10;

  // Showtime
  pdf.setTextColor(107, 114, 128);
  pdf.text('Showtime:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${transaction.jadwal}:00`, 70, yPos);

  yPos += 20;

  // Customer information section
  if (transaction.customerName) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(5, 150, 105);
    pdf.text('CUSTOMER INFORMATION', 20, yPos);

    yPos += 15;

    // Customer name
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text('Name:', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    pdf.text(transaction.customerName, 70, yPos);

    yPos += 10;

    // Email
    if (transaction.customerEmail) {
      pdf.setTextColor(107, 114, 128);
      pdf.text('Email:', 20, yPos);
      pdf.setTextColor(0, 0, 0);
      pdf.text(transaction.customerEmail, 70, yPos);
      yPos += 10;
    }

    // Phone
    if (transaction.customerPhone) {
      pdf.setTextColor(107, 114, 128);
      pdf.text('Phone:', 20, yPos);
      pdf.setTextColor(0, 0, 0);
      pdf.text(transaction.customerPhone, 70, yPos);
      yPos += 10;
    }

    yPos += 10;
  }

  // Booking details section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(5, 150, 105);
  pdf.text('BOOKING DETAILS', 20, yPos);

  yPos += 15;

  // Seats
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Seats:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(seats, 70, yPos);

  yPos += 10;

  // Number of tickets
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Tickets:', 20, yPos);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${orderDetails.length} ticket(s)`, 70, yPos);

  yPos += 15;

  // Total amount
  pdf.setTextColor(107, 114, 128);
  pdf.text('TOTAL PAID:', 20, yPos);
  pdf.setTextColor(5, 150, 105); // Green color for amount
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  const totalAmount = transaction.totalharga || transaction.totalHarga || 0;
  pdf.text(`Rp ${totalAmount.toLocaleString('id-ID')}`, 70, yPos);

  yPos += 15;

  // Payment status
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Status:', 20, yPos);
  pdf.setTextColor(34, 197, 94); // Green
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAID', 70, yPos);

  // Generate QR Code for receipt
  const qrData = JSON.stringify({
    transactionId: transaction.id,
    movieTitle: movie.title,
    showtime: `${transaction.jadwal}:00`,
    seats: seats,
    totalPaid: totalAmount,
    paymentMethod: paymentMethod,
    date: transactionDate
  });

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 100,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Add QR code to PDF
    pdf.addImage(qrCodeDataURL, 'PNG', 140, 120, 40, 40);

    // QR code label
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text('Scan for verification', 145, 170);

  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  yPos = 220;
  pdf.setFillColor(248, 250, 252); // Light gray background
  pdf.rect(15, yPos, 180, 25, 'F');

  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Contact: info@bioskopsandra.com', 20, yPos + 8);
  pdf.text('Website: www.bioskopsandra.com', 20, yPos + 16);
  pdf.text('Thank you for your payment! Keep this receipt for your records.', 20, yPos + 24);

  // Save the PDF
  const fileName = `BioskopSandra_Receipt_${transaction.id}.pdf`;
  pdf.save(fileName);
};
