let currentFlight = null;
let selectedSeat = null;
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

if (authToken && currentUser) {
    updateAuthUI();
}

function showHome() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('homePage').classList.add('active');
    document.getElementById('flightResults').style.display = 'none';
}

function showBookingPage() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('bookingPage').classList.add('active');
}

function showPaymentPage() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('paymentPage').classList.add('active');
}

function showConfirmationPage() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('confirmationPage').classList.add('active');
}

function showMyBookings() {
    if (!authToken) {
        alert('Please login to view your bookings');
        showAuthModal('login');
        return;
    }
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('myBookingsPage').classList.add('active');
    loadMyBookings();
}

function showAuthModal(type) {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
    
    modal.classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

async function register() {
    const fullName = document.getElementById('registerFullName').value;
    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!fullName || !email || !username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            showAuthModal('login');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        alert('Registration failed. Please try again.');
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = { userId: data.userId, username: data.username, fullName: data.fullName };
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeAuthModal();
            alert('Login successful!');
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Login failed. Please try again.');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showHome();
}

function updateAuthUI() {
    if (authToken && currentUser) {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'inline';
        document.getElementById('myBookingsLink').style.display = 'inline';
    } else {
        document.getElementById('loginLink').style.display = 'inline';
        document.getElementById('logoutLink').style.display = 'none';
        document.getElementById('myBookingsLink').style.display = 'none';
    }
}

async function searchFlights() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    
    if (!origin || !destination) {
        alert('Please select both origin and destination');
        return;
    }
    
    if (origin === destination) {
        alert('Origin and destination cannot be the same');
        return;
    }
    
    try {
        const response = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}`);
        const flights = await response.json();
        
        displayFlights(flights);
    } catch (error) {
        alert('Failed to search flights. Please try again.');
    }
}

function displayFlights(flights) {
    const flightsList = document.getElementById('flightsList');
    const flightResults = document.getElementById('flightResults');
    
    if (flights.length === 0) {
        flightsList.innerHTML = '<p style="color: white; text-align: center;">No flights found for this route.</p>';
        flightResults.style.display = 'block';
        return;
    }
    
    flightsList.innerHTML = flights.map(flight => `
        <div class="flight-card">
            <div>
                <div class="flight-route">${flight.origin} → ${flight.destination}</div>
                <div class="flight-time">Flight ${flight.flightNumber}</div>
                <div class="flight-time">${formatDateTime(flight.departureTime)} - ${formatDateTime(flight.arrivalTime)}</div>
            </div>
            <div>
                <div style="color: #666;">Available Seats</div>
                <div style="font-weight: bold;">${flight.availableSeats}</div>
            </div>
            <div class="flight-price">$${flight.price.toFixed(2)}</div>
            <div>
                <button class="btn btn-primary" onclick="selectFlight(${flight.id})">Book Now</button>
            </div>
        </div>
    `).join('');
    
    flightResults.style.display = 'block';
}

async function selectFlight(flightId) {
    if (!authToken) {
        alert('Please login to book a flight');
        showAuthModal('login');
        return;
    }
    
    try {
        const response = await fetch(`/api/flights/${flightId}`);
        currentFlight = await response.json();
        
        displayFlightDetails();
        generateSeatMap();
        showBookingPage();
    } catch (error) {
        alert('Failed to load flight details. Please try again.');
    }
}

function displayFlightDetails() {
    const flightDetails = document.getElementById('flightDetails');
    flightDetails.innerHTML = `
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;">
            <h3 style="color: #667eea; margin-bottom: 0.5rem;">Flight ${currentFlight.flightNumber}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <strong>Route:</strong> ${currentFlight.origin} → ${currentFlight.destination}
                </div>
                <div>
                    <strong>Price:</strong> $${currentFlight.price.toFixed(2)}
                </div>
                <div>
                    <strong>Departure:</strong> ${formatDateTime(currentFlight.departureTime)}
                </div>
                <div>
                    <strong>Arrival:</strong> ${formatDateTime(currentFlight.arrivalTime)}
                </div>
            </div>
        </div>
    `;
}

function generateSeatMap() {
    const seatMap = document.getElementById('seatMap');
    const rows = 8;
    const seatsPerRow = 6;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    let html = '';
    for (let row = 1; row <= rows; row++) {
        for (let col = 0; col < seatsPerRow; col++) {
            const seatNumber = `${row}${letters[col]}`;
            const isOccupied = Math.random() < 0.3;
            const className = isOccupied ? 'seat occupied' : 'seat available';
            html += `<div class="${className}" data-seat="${seatNumber}" onclick="selectSeat('${seatNumber}', this)"></div>`;
        }
    }
    
    seatMap.innerHTML = html;
}

function selectSeat(seatNumber, element) {
    if (element.classList.contains('occupied')) {
        return;
    }
    
    document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
    element.classList.add('selected');
    selectedSeat = seatNumber;
}

function proceedToPayment() {
    const passengerName = document.getElementById('passengerName').value;
    
    if (!passengerName) {
        alert('Please enter passenger name');
        return;
    }
    
    if (!selectedSeat) {
        alert('Please select a seat');
        return;
    }
    
    displayPaymentSummary(passengerName);
    showPaymentPage();
}

function displayPaymentSummary(passengerName) {
    const summary = document.getElementById('paymentSummary');
    summary.innerHTML = `
        <h3 style="color: #667eea; margin-bottom: 1rem;">Booking Summary</h3>
        <div class="summary-row">
            <span>Passenger:</span>
            <span><strong>${passengerName}</strong></span>
        </div>
        <div class="summary-row">
            <span>Flight:</span>
            <span><strong>${currentFlight.flightNumber}</strong></span>
        </div>
        <div class="summary-row">
            <span>Route:</span>
            <span><strong>${currentFlight.origin} → ${currentFlight.destination}</strong></span>
        </div>
        <div class="summary-row">
            <span>Seat:</span>
            <span><strong>${selectedSeat}</strong></span>
        </div>
        <div class="summary-row">
            <span>Departure:</span>
            <span><strong>${formatDateTime(currentFlight.departureTime)}</strong></span>
        </div>
        <div class="summary-row total">
            <span>Total Amount:</span>
            <span>$${currentFlight.price.toFixed(2)}</span>
        </div>
    `;
}

async function confirmPayment() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardholderName = document.getElementById('cardholderName').value;
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        alert('Please fill in all payment details');
        return;
    }
    
    const passengerName = document.getElementById('passengerName').value;
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                flightId: currentFlight.id,
                passengerName: passengerName,
                seatNumber: selectedSeat
            })
        });
        
        const booking = await response.json();
        
        if (response.ok) {
            displayConfirmation(booking);
            showConfirmationPage();
            clearBookingForm();
        } else {
            alert(booking.error || 'Booking failed. Please try again.');
        }
    } catch (error) {
        alert('Payment processing failed. Please try again.');
    }
}

function displayConfirmation(booking) {
    const details = document.getElementById('confirmationDetails');
    details.innerHTML = `
        <div class="booking-ref">${booking.bookingReference}</div>
        <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">
            Please save this booking reference for your records
        </p>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
            <div style="margin-bottom: 0.5rem;"><strong>Passenger:</strong> ${booking.passengerName}</div>
            <div style="margin-bottom: 0.5rem;"><strong>Seat:</strong> ${booking.seatNumber}</div>
            <div style="margin-bottom: 0.5rem;"><strong>Amount Paid:</strong> $${booking.totalPrice.toFixed(2)}</div>
            <div><strong>Status:</strong> <span style="color: #28a745;">${booking.paymentStatus}</span></div>
        </div>
    `;
}

function clearBookingForm() {
    document.getElementById('passengerName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('cardholderName').value = '';
    selectedSeat = null;
    currentFlight = null;
}

async function loadMyBookings() {
    try {
        const response = await fetch('/api/bookings/my-bookings', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const bookings = await response.json();
        displayMyBookings(bookings);
    } catch (error) {
        alert('Failed to load bookings. Please try again.');
    }
}

function displayMyBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p style="text-align: center; color: white;">You have no bookings yet.</p>';
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-history-card">
            <h3 style="color: #667eea;">Booking Reference: ${booking.bookingReference}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div><strong>Passenger:</strong> ${booking.passengerName}</div>
                <div><strong>Seat:</strong> ${booking.seatNumber}</div>
                <div><strong>Amount:</strong> $${booking.totalPrice.toFixed(2)}</div>
                <div><strong>Status:</strong> <span style="color: #28a745;">${booking.paymentStatus}</span></div>
                <div><strong>Booked:</strong> ${formatDateTime(booking.bookingTime)}</div>
            </div>
        </div>
    `).join('');
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});
