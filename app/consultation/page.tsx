"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ConsultationPage() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the message to the backend
    console.log("Message submitted:", message)
    setMessage("")
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Online Consultation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Chat with Dr. Smith</CardTitle>
          <CardDescription>Describe your symptoms or ask health-related questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Dr. Smith" />
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <p>Hello! How can I help you today?</p>
              </div>
            </div>
            {/* Add more message bubbles as needed */}
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

