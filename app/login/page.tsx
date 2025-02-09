"use client";

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "../contexts/AuthContext"
import { HeartPulse, Stethoscope, UserCircle } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()
  
  const containerRef = useRef<HTMLDivElement>(null)
  const ecgLineRef = useRef<SVGPathElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const roleFieldRef = useRef<HTMLDivElement>(null)

  // Redirect if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.push("/");
    }
  }, [router]);

  // Initialize animations
  useEffect(() => {
    // Initial card animation
    gsap.from(".auth-card", {
      duration: 1,
      scale: 0.8,
      opacity: 0,
      ease: "power3.out",
    })

    // Decorative elements animation
    gsap.from(".decorative-element", {
      duration: 1.5,
      scale: 0,
      rotation: 180,
      stagger: 0.2,
      ease: "elastic.out(1, 0.5)",
    })

    // ECG line animation
    if (ecgLineRef.current) {
      const pathLength = ecgLineRef.current.getTotalLength()
      ecgLineRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`
      ecgLineRef.current.style.strokeDashoffset = `${pathLength}`

      gsap.to(ecgLineRef.current, {
        strokeDashoffset: 0,
        duration: 2,
        repeat: -1,
        ease: "none",
      })
    }

    // Floating animation for icons
    gsap.to(".floating-element", {
      y: 15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    // Plus symbols animation
    document.querySelectorAll('.plus-symbol').forEach((plus) => {
      gsap.to(plus, {
        rotation: 180,
        scale: gsap.utils.random(0.5, 1),
        opacity: gsap.utils.random(0.2, 0.5),
        duration: gsap.utils.random(3, 5),
        repeat: -1,
        yoyo: true,
        ease: "none",
      })
    })

    // Background pattern animation
    gsap.to(".bg-pattern", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      ease: "none",
    })

    // Login content animation from second file
    gsap.from(".login-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
    })
  }, [])

  // Form transition effect
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 }
      )
    }
  }, [isLogin])

  // Role field animation
  useEffect(() => {
    if (!isLogin && roleFieldRef.current) {
      gsap.fromTo(
        roleFieldRef.current,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.3 }
      )
    }
  }, [isLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data.message);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/");
          window.location.reload();
        } else {
          setErrorMessage("Unexpected server response. Please try again.");
        }
      } else {
        setErrorMessage(data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 bg-pattern"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 10%, #3B82F622 20%, transparent 20%)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ECG Line Animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          ref={ecgLineRef}
          d="M0 100 Q 200 50 400 150 T 800 100"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
          className="opacity-20"
        />
      </svg>

      {/* Floating Medical Icons */}
      <HeartPulse className="absolute top-1/4 left-20 text-blue-200/30 floating-element h-16 w-16 decorative-element" />
      <Stethoscope className="absolute top-1/3 right-32 text-blue-200/30 floating-element h-16 w-16 decorative-element" />

      {/* Main Card */}
      <div
        ref={containerRef}
        className="auth-card bg-white p-8 rounded-xl shadow-2xl w-96 relative z-10 border border-blue-50"
      >
        <div ref={formRef} className="login-content">
          <div className="text-center mb-8">
            <div className="inline-block">
              <HeartPulse className="h-16 w-16 text-blue-600 mx-auto mb-4 decorative-element" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? "Welcome Back!" : "Join HealthBuddy"}
            </h2>
            <p className="text-gray-600">
              {isLogin ? "Secure access to your health portal" : "Start your health journey today"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="login-content">
              <Label htmlFor="username" className="flex items-center gap-2 text-gray-700">
                <UserCircle className="h-4 w-4" />
                Username
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 focus-visible:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>

            <div className="login-content">
              <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z" />
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 focus-visible:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div ref={roleFieldRef} className="login-content overflow-hidden">
                <Label className="block mb-2 text-gray-700">Register as:</Label>
                <RadioGroup value={role} onValueChange={setRole} className="grid gap-2">
                  {["user", "doctor"].map((r) => (
                    <div
                      key={r}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-blue-50 transition-colors hover:scale-[1.02]"
                    >
                      <RadioGroupItem value={r} id={r} />
                      <Label htmlFor={r} className="flex-1">
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </Label>
                      {r === "doctor" ? (
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      ) : (
                        <UserCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Single Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 login-content"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <p className="login-content text-center mt-6 text-gray-600">
            {isLogin ? "New here? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-semibold hover:underline underline-offset-4"
            >
              {isLogin ? "Create Account" : "Login Instead"}
            </button>
          </p>
        </div>
      </div>

      {/* Animated Plus Symbols */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-blue-200/20 plus-symbol"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
