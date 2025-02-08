"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutUsPage() {
  useEffect(() => {
    gsap.from(".about-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="about-content text-3xl font-bold text-center mb-8">About HealthBuddy</h1>
      <div className="about-content space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              At HealthBuddy, our mission is to make healthcare accessible, convenient, and personalized for everyone.
              We strive to bridge the gap between patients and healthcare providers through innovative technology and
              compassionate care.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We envision a world where quality healthcare is just a click away. Our platform aims to revolutionize the
              healthcare industry by leveraging cutting-edge technology to provide seamless, efficient, and effective
              medical services.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              HealthBuddy is powered by a diverse team of healthcare professionals, technologists, and innovators. Our
              experts are committed to delivering the best possible healthcare experience for our users.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We are dedicated to maintaining the highest standards of medical ethics, data privacy, and user
              satisfaction. Your health and well-being are our top priorities, and we continuously strive to improve our
              services based on user feedback and the latest advancements in healthcare technology.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

