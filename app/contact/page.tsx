"use client";

import { useState } from "react";
import {
  Stethoscope,
  Pill,
  HeartPulseIcon as Heartbeat,
  AmbulanceIcon as FirstAid,
  Phone,
  Mail,
  Clock,
  Activity,
  Thermometer,
  Syringe,
  Send,
  User,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Added state for success message

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(""); // Clear previous message

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Thank you for your response! We will get back to you soon."); 
        toast({ title: "Success", description: "Your message has been sent!" });

        event.currentTarget.reset(); // Reset form

        setTimeout(() => setSuccessMessage(""), 5000); // ✅ Hide message after 5 seconds
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
            Get in Touch
          </h1>
          <p className="text-center text-gray-600 mb-8">
            We're here to help with any medical inquiries or concerns.
          </p>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input name="name" required placeholder="Your full name" />
              <Input name="email" type="email" required placeholder="your.email@example.com" />
              <Input name="phone" type="tel" placeholder="Your phone number" />
              <Input name="preferredDate" type="date" />
            </div>

            <div className="space-y-4">
              <Select name="department">
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                </SelectContent>
              </Select>
              <Select name="urgency">
                <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Input name="subject" required placeholder="Brief subject of your inquiry" />
              <Textarea name="message" required placeholder="Please provide details..." />
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-4">
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin"><Heartbeat size={18} /></span>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={18} />
                    Send Message
                  </span>
                )}
              </Button>

              {successMessage && (
                <p className="text-green-600 font-medium text-center">{successMessage}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
