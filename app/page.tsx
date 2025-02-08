"use client"

import { useEffect } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { useAuth } from "./contexts/AuthContext"

export default function HomePage() {
  const { user } = useAuth()

  useEffect(() => {
    gsap.from(".hero-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
    })

    gsap.to(".bg-animation", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-animation bg-gradient-to-br from-sky-100 to-white bg-[length:400%_400%]">
      <div className="text-center">
        <h1 className="hero-content text-4xl font-bold text-gray-900 mb-4">Welcome to HealthBuddy</h1>
        <p className="hero-content text-xl text-gray-600 mb-8">Your trusted healthcare companion</p>
        <div className="hero-content flex justify-center space-x-4">
          {user ? (
            user.role === "doctor" ? (
              <>
                <Button asChild>
                  <Link
                    href="/doctor/appointments"
                    className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition duration-300"
                  >
                    View Appointments
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/ai-help"
                    className="bg-white text-sky-500 border border-sky-500 px-6 py-3 rounded-md hover:bg-sky-50 transition duration-300"
                  >
                    Get Help with AI
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link
                    href="/consultation"
                    className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition duration-300"
                  >
                    Start Consultation
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/appointment"
                    className="bg-white text-sky-500 border border-sky-500 px-6 py-3 rounded-md hover:bg-sky-50 transition duration-300"
                  >
                    Book an Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/ai-help"
                    className="bg-white text-sky-500 border border-sky-500 px-6 py-3 rounded-md hover:bg-sky-50 transition duration-300"
                  >
                    Chat with AI
                  </Link>
                </Button>
              </>
            )
          ) : (
            <Button asChild>
              <Link
                href="/login"
                className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition duration-300"
              >
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

