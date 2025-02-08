"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AIHelpPage() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to your AI service
    // For this example, we'll just set a dummy response
    setResponse(`AI response to: "${query}"`)
    setQuery("")
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Medical Assistant</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ask AI for Medical Advice</CardTitle>
          <CardDescription>Enter your medical question and our AI will provide assistance.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your medical question..."
            />
            <Button type="submit">Ask AI</Button>
          </form>
          {response && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">AI Response:</h2>
              <p>{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">AI in Healthcare</h2>
        <p className="mb-4">Artificial Intelligence is revolutionizing the healthcare industry. It's being used to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Assist in diagnosis and treatment planning</li>
          <li>Analyze medical images with greater accuracy</li>
          <li>Predict patient outcomes and recommend personalized treatments</li>
          <li>Streamline administrative tasks and improve efficiency</li>
        </ul>
      </div>
    </div>
  )
}

