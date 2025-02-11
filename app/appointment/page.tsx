"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  imageUrl?: string;
  fees: number;
  availability: string;
  rating: number;
}

export default function AppointmentPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors", { method: "GET" });
  
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
  
        const data = await res.json();
        console.log("Doctors fetched:", data); // Debugging
        setDoctors(data?.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]); // Prevent undefined state
      }
    };
    fetchDoctors();
  }, []);
  
  

  useEffect(() => {
    gsap.from(".appointment-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
    });
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );  

  const handleBookAppointment = async () => {
    if (!user) {
      alert("Please login to book appointments");
      return;
    }
  
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert("Please select a doctor, date, and time");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date: selectedDate.toISOString(),
          time: selectedTime,
          userId: user._id,
          status: "pending",
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
  
      const data = await response.json();
      alert(data.message);
      setSelectedDoctor(null);
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred while booking the appointment: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="appointment-content text-3xl font-bold text-center mb-8">Book an Appointment</h1>
      <div className="appointment-content mb-8">
        <Label htmlFor="search">Search for doctors</Label>
        <Input 
          id="search" 
          placeholder="Search by name or speciality..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      <div className="appointment-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor._id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <Avatar className="w-16 h-16 mx-auto">
                <AvatarImage src={doctor.imageUrl || `https://i.pravatar.cc/150?u=${doctor._id}`} />
                <AvatarFallback>{doctor.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-center mt-2">{doctor.name}</CardTitle>
              <CardDescription className="text-center">{doctor.speciality}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-2">Fees: ${doctor.fees}</p>
              <p className="text-center mb-2">Available: {doctor.availability}</p>
              <div className="flex justify-center items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1">{doctor.rating}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedDoctor(doctor)}>
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book Appointment with {selectedDoctor?.name}</DialogTitle>
                    <DialogDescription>Select your preferred date and time</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date as Date)}
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                    <Select onValueChange={(value) => setSelectedTime(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">02:00 PM</SelectItem>
                        <SelectItem value="15:00">03:00 PM</SelectItem>
                        <SelectItem value="16:00">04:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleBookAppointment} disabled={loading}>
                      {loading ? "Booking..." : "Confirm Booking"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
