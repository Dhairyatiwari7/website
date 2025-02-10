import { hash } from "bcryptjs";
import clientPromise from "../app/lib/db";

async function insertDoctors() {
  const client = await clientPromise;
  const db = client.db("test"); // Make sure your DB name is correct
  const doctorsCollection = db.collection("doctors");

  const doctors = [
    { "name": "Dr. Pratik Sharma", "speciality": "Cardiologist", "fees": 1500, "availability": ["Mon", "Wed", "Fri"], "rating": 4.5, "password": "password1" },
    { "name": "Dr. Rishabh Jain", "speciality": "Dermatologist", "fees": 950, "availability": ["Tue", "Thu", "Sat"], "rating": 4.8, "password": "password2" },
    { "name": "Dr. Parth Singh", "speciality": "Pediatrician", "fees": 800, "availability": ["Mon", "Tue", "Thu"], "rating": 4.7, "password": "password3" },
    { "name": "Dr. Amrit Raj", "speciality": "Orthopedic Surgeon", "fees": 1200, "availability": ["Wed", "Fri", "Sat"], "rating": 4.9, "password": "password4" },
    { "name": "Dr. Aman Bajpai", "speciality": "Neurologist", "fees": 1100, "availability": ["Mon", "Thu", "Fri"], "rating": 4.6, "password": "password5" },
    { "name": "Dr. Akhilesh Deshmukh", "speciality": "Ophthalmologist", "fees": 950, "availability": ["Tue", "Wed", "Sat"], "rating": 4.7, "password": "password6" },
    { "name": "Dr. Palak Yadav", "speciality": "Gynecologist", "fees": 1050, "availability": ["Mon", "Wed", "Fri"], "rating": 4.8, "password": "password7" },
    { "name": "Dr. Sunidhi Sharma", "speciality": "Psychiatrist", "fees": 1300, "availability": ["Tue", "Thu", "Sat"], "rating": 4.5, "password": "password8" },
    { "name": "Dr. Pradhi Raj", "speciality": "Endocrinologist", "fees": 1000, "availability": ["Mon", "Wed", "Fri"], "rating": 4.6, "password": "password9" },
    { "name": "Dr. Akansha Mittal", "speciality": "Urologist", "fees": 1100, "availability": ["Tue", "Thu", "Sat"], "rating": 4.7, "password": "password10" },
        { "name": "Dr. Vikas Mehta", "speciality": "Cardiologist", "fees": 1400, "availability": ["Mon", "Tue", "Fri"], "rating": 4.6, "password": "password11" },
        { "name": "Dr. Priya Verma", "speciality": "Dermatologist", "fees": 850, "availability": ["Wed", "Thu", "Sat"], "rating": 4.7, "password": "password12" },
        { "name": "Dr. Anil Agarwal", "speciality": "Pediatrician", "fees": 950, "availability": ["Mon", "Thu", "Sun"], "rating": 4.8, "password": "password13" },
        { "name": "Dr. Shubham Rai", "speciality": "Orthopedic Surgeon", "fees": 1300, "availability": ["Tue", "Fri", "Sat"], "rating": 4.9, "password": "password14" },
        { "name": "Dr. Manisha Gupta", "speciality": "Neurologist", "fees": 1150, "availability": ["Mon", "Wed", "Thu"], "rating": 4.5, "password": "password15" },
        { "name": "Dr. Sudhir Patel", "speciality": "Ophthalmologist", "fees": 1050, "availability": ["Tue", "Fri", "Sun"], "rating": 4.7, "password": "password16" },
        { "name": "Dr. Neha Yadav", "speciality": "Gynecologist", "fees": 1250, "availability": ["Mon", "Wed", "Thu"], "rating": 4.8, "password": "password17" },
        { "name": "Dr. Arjun Verma", "speciality": "Psychiatrist", "fees": 1500, "availability": ["Tue", "Fri", "Sat"], "rating": 4.6, "password": "password18" },
        { "name": "Dr. Shruti Desai", "speciality": "Endocrinologist", "fees": 1100, "availability": ["Mon", "Wed", "Thu"], "rating": 4.5, "password": "password19" },
        { "name": "Dr. Ravi Kumar", "speciality": "Urologist", "fees": 1200, "availability": ["Tue", "Wed", "Sat"], "rating": 4.8, "password": "password20" },
        { "name": "Dr. Sushil Chopra", "speciality": "Cardiologist", "fees": 1350, "availability": ["Mon", "Thu", "Fri"], "rating": 4.7, "password": "password21" },
        { "name": "Dr. Neelam Bansal", "speciality": "Dermatologist", "fees": 900, "availability": ["Tue", "Fri", "Sun"], "rating": 4.6, "password": "password22" },
        { "name": "Dr. Vishal Saini", "speciality": "Pediatrician", "fees": 1000, "availability": ["Mon", "Wed", "Fri"], "rating": 4.8, "password": "password23" },
        { "name": "Dr. Anurag Tiwari", "speciality": "Orthopedic Surgeon", "fees": 1250, "availability": ["Mon", "Wed", "Sat"], "rating": 4.9, "password": "password24" },
        { "name": "Dr. Aarti Pandey", "speciality": "Neurologist", "fees": 950, "availability": ["Tue", "Thu", "Sat"], "rating": 4.7, "password": "password25" },
        { "name": "Dr. Rohit Joshi", "speciality": "Ophthalmologist", "fees": 1000, "availability": ["Mon", "Fri", "Sun"], "rating": 4.6, "password": "password26" },
        { "name": "Dr. Shraddha Agarwal", "speciality": "Gynecologist", "fees": 1100, "availability": ["Mon", "Thu", "Sat"], "rating": 4.8, "password": "password27" },
        { "name": "Dr. Rajesh Patil", "speciality": "Psychiatrist", "fees": 1400, "availability": ["Tue", "Wed", "Sat"], "rating": 4.5, "password": "password28" },
        { "name": "Dr. Shalini Reddy", "speciality": "Endocrinologist", "fees": 950, "availability": ["Mon", "Wed", "Thu"], "rating": 4.7, "password": "password29" },
        { "name": "Dr. Amanpreet Kaur", "speciality": "Urologist", "fees": 1050, "availability": ["Tue", "Thu", "Sun"], "rating": 4.6, "password": "password30" },
        { "name": "Dr. Meenal Kapoor", "speciality": "Gastroenterologist", "fees": 1200, "availability": ["Mon", "Wed", "Fri"], "rating": 4.7, "password": "password31" },
        { "name": "Dr. Tanvi Agarwal", "speciality": "Pulmonologist", "fees": 1250, "availability": ["Tue", "Thu", "Sat"], "rating": 4.8, "password": "password32" },
        { "name": "Dr. Nikhil Mehta", "speciality": "Rheumatologist", "fees": 1100, "availability": ["Mon", "Thu", "Sat"], "rating": 4.6, "password": "password33" },
        { "name": "Dr. Kiran Gupta", "speciality": "Oncologist", "fees": 1500, "availability": ["Wed", "Fri", "Sun"], "rating": 4.9, "password": "password34" },
        { "name": "Dr. Amita Jain", "speciality": "Nephrologist", "fees": 1300, "availability": ["Mon", "Tue", "Thu"], "rating": 4.7, "password": "password35" },
        { "name": "Dr. Sameer Patel", "speciality": "Allergist", "fees": 950, "availability": ["Mon", "Wed", "Fri"], "rating": 4.8, "password": "password36" },
        { "name": "Dr. Ayesha Khan", "speciality": "Hematologist", "fees": 1400, "availability": ["Tue", "Thu", "Sat"], "rating": 4.6, "password": "password37" },
        { "name": "Dr. Harish Verma", "speciality": "Plastic Surgeon", "fees": 1800, "availability": ["Mon", "Wed", "Fri"], "rating": 4.9, "password": "password38" }
    
    
  ]

  for (let doctor of doctors) {
    doctor.password = await hash(doctor.password, 10); // Hash passwords before saving
  }

  await doctorsCollection.insertMany(doctors);
  console.log("✅ Doctors inserted successfully!");
}

insertDoctors().catch(console.error);
