import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Calendar, Brain, FileText, Bell, Activity } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCardPreview: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group transition-all duration-300 hover:z-10">
      <div className="transform transition-all duration-300 group-hover:-translate-y-4 group-hover:shadow-2xl">
        <Card className="overflow-hidden bg-white rounded-2xl h-full transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="mb-4 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:transform">
              {icon}
            </div>
            <CardTitle className="text-xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 transition-opacity duration-300 group-hover:opacity-90">
              {description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Preview() {
  const services = [
    {
      title: "Online Consultations",
      description: "Connect with healthcare professionals from the comfort of your home.",
      icon: <Video className="w-6 h-6" />
    },
    {
      title: "Appointment Booking",
      description: "Easily schedule appointments with your preferred doctors.",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: "AI-Powered Health Assistant",
      description: "Get instant answers to your health queries using our advanced AI.",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Electronic Health Records",
      description: "Securely store and access your medical history anytime, anywhere.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Medication Reminders",
      description: "Never miss a dose with our smart medication reminder system.",
      icon: <Bell className="w-6 h-6" />
    },
    {
      title: "Health Tracking",
      description: "Monitor your vital signs and health metrics with our user-friendly tools.",
      icon: <Activity className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Our Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCardPreview
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
