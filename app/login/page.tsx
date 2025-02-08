"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "doctor">("user");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    gsap.from(".login-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
    });
  }, []);

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

        // Save user data
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "doctor") {
          router.push("/home-direct/doctor");
        } else {
          router.push("/home-direct/user");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="login-content text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to QuickCare" : "Sign Up for QuickCare"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="login-content">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="login-content">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {!isLogin && (
            <div className="login-content">
              <Label>Register as</Label>
              <RadioGroup value={role} onValueChange={(value: string) => setRole(value as "user" | "doctor")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor">Doctor</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <Button className="login-content w-full" type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <p className="login-content text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="text-sky-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
