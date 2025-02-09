"use client"
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { toast } = useToast();
  const sessionData = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    contact: "",
    email: "",
    nationality: "",
    address: "",
  });

  const session = sessionData?.data; // Ensure sessionData exists before accessing `.data`
  const status = sessionData?.status;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    gsap.from(".profile-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
    });

    if (session?.user?.email) {
      fetchProfileData();
    }
  }, [status, session]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          ...data,
        }));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch profile data",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="profile-content text-3xl font-bold text-center mb-8">My Profile</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="profile-content grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Enter your name" />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={formData.age} onChange={(e) => handleChange("age", e.target.value)} placeholder="Enter your age" />
          </div>
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input id="contact" type="tel" value={formData.contact} onChange={(e) => handleChange("contact", e.target.value)} placeholder="Enter your contact number" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Enter your email address" disabled />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" value={formData.nationality} onChange={(e) => handleChange("nationality", e.target.value)} placeholder="Enter your nationality" />
          </div>
        </div>
        <div className="profile-content">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Enter your address" />
        </div>
        <Button className="profile-content w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
