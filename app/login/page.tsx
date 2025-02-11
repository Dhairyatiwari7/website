"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HeartPulse, Stethoscope, UserCircle } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Redirect if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.push("/");
    }
  }, [router]);

  // Initialize animations
  useEffect(() => {
    gsap.from(".auth-card", { duration: 1, scale: 0.8, opacity: 0, ease: "power3.out" });
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error
    setIsLoading(true);  // Start loading

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = isLogin ? { username, password } : { username, password, role };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
        window.location.reload();
      } else {
        setErrorMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("Network error occurred");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-hidden">
      <div className="auth-card bg-white p-8 rounded-xl shadow-2xl w-96">
        <div className="text-center mb-8">
          <HeartPulse className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{isLogin ? "Welcome Back!" : "Join QuickCare"}</h2>
          <p className="text-gray-600">{isLogin ? "Secure access to your health portal" : "Start your health journey today"}</p>
        </div>

        {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username" className="flex items-center gap-2 text-gray-700">
              <UserCircle className="h-4 w-4" />
              Username
            </Label>
            <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
              Password
            </Label>
            <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </div>

          {!isLogin && (
            <div>
              <Label className="block mb-2 text-gray-700">Register as:</Label>
              <RadioGroup value={role} onValueChange={setRole}>
                {["user", "doctor"].map((r) => (
                  <div key={r} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                    <RadioGroupItem value={r} id={r} />
                    <Label htmlFor={r} className="flex-1">{r.charAt(0).toUpperCase() + r.slice(1)}</Label>
                    {r === "doctor" ? <Stethoscope className="h-4 w-4 text-blue-600" /> : <UserCircle className="h-4 w-4 text-blue-600" />}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg" disabled={isLoading}>
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "New here? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-semibold hover:underline">
            {isLogin ? "Create Account" : "Login Instead"}
          </button>
        </p>
      </div>
    </div>
  );
}
