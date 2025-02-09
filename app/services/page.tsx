"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Online Consultations",
    description: "Connect with healthcare professionals from the comfort of your home.",
  },
  { title: "Appointment Booking", description: "Easily schedule appointments with your preferred doctors." },
  {
    title: "AI-Powered Health Assistant",
    description: "Get instant answers to your health queries using our advanced AI.",
  },
  {
    title: "Electronic Health Records",
    description: "Securely store and access your medical history anytime, anywhere.",
  },
  { title: "Medication Reminders", description: "Never miss a dose with our smart medication reminder system." },
  {
    title: "Health Tracking",
    description: "Monitor your vital signs and health metrics with our user-friendly tools.",
  },
]

export default function ServicesPage() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]

    gsap.from(cards, {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
    })

    const infiniteAnimation = gsap.to(cards, {
      y: 10,
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 1.5,
    })

    return () => {
      infiniteAnimation.kill()
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
            <Card key={index} ref={(el) => {(cardsRef.current[index] as HTMLDivElement | null) = el;}}className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

