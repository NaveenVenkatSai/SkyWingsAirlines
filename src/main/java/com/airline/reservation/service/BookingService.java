package com.airline.reservation.service;

import com.airline.reservation.model.Booking;
import com.airline.reservation.model.Flight;
import com.airline.reservation.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightService flightService;

    public Booking createBooking(Long userId, Long flightId, String passengerName, String seatNumber) {
        Flight flight = flightService.getFlightById(flightId);
        if (flight == null) {
            throw new RuntimeException("Flight not found");
        }

        if (flight.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }

        String bookingRef = generateBookingReference();
        Booking booking = new Booking(userId, flightId, passengerName, seatNumber, 
                                     bookingRef, flight.getPrice(), "CONFIRMED");
        
        flight.setAvailableSeats(flight.getAvailableSeats() - 1);
        
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    private String generateBookingReference() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder ref = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            ref.append(chars.charAt(random.nextInt(chars.length())));
        }
        return ref.toString();
    }
}
