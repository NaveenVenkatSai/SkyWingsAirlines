package com.airline.reservation.service;

import com.airline.reservation.model.Flight;
import com.airline.reservation.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    @PostConstruct
    public void initializeFlights() {
        if (flightRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();
            
            flightRepository.save(new Flight("AA101", "New York", "Los Angeles", 
                now.plusDays(1).withHour(8).withMinute(0), 
                now.plusDays(1).withHour(11).withMinute(30), 
                299.99, 150));
            
            flightRepository.save(new Flight("AA102", "Los Angeles", "New York", 
                now.plusDays(1).withHour(14).withMinute(0), 
                now.plusDays(1).withHour(22).withMinute(30), 
                349.99, 150));
            
            flightRepository.save(new Flight("AA103", "Chicago", "Miami", 
                now.plusDays(2).withHour(9).withMinute(30), 
                now.plusDays(2).withHour(13).withMinute(0), 
                199.99, 180));
            
            flightRepository.save(new Flight("AA104", "Miami", "Chicago", 
                now.plusDays(2).withHour(15).withMinute(0), 
                now.plusDays(2).withHour(18).withMinute(30), 
                219.99, 180));
            
            flightRepository.save(new Flight("AA105", "San Francisco", "Seattle", 
                now.plusDays(3).withHour(7).withMinute(0), 
                now.plusDays(3).withHour(9).withMinute(30), 
                149.99, 120));
            
            flightRepository.save(new Flight("AA106", "Seattle", "San Francisco", 
                now.plusDays(3).withHour(11).withMinute(0), 
                now.plusDays(3).withHour(13).withMinute(30), 
                159.99, 120));
            
            flightRepository.save(new Flight("AA107", "Boston", "Orlando", 
                now.plusDays(4).withHour(10).withMinute(0), 
                now.plusDays(4).withHour(13).withMinute(30), 
                249.99, 200));
            
            flightRepository.save(new Flight("AA108", "Orlando", "Boston", 
                now.plusDays(4).withHour(16).withMinute(0), 
                now.plusDays(4).withHour(19).withMinute(30), 
                269.99, 200));
        }
    }

    public List<Flight> searchFlights(String origin, String destination) {
        if (origin != null && !origin.isEmpty() && destination != null && !destination.isEmpty()) {
            return flightRepository.findByOriginAndDestination(origin, destination);
        }
        return flightRepository.findAll();
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id).orElse(null);
    }
}
