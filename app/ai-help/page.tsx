"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIHelpPage() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Help</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full h-[450px]">
          <iframe
            src="https://app.dante-ai.com/embed/?kb_id=f915a2a9-d3d4-411a-a165-af28dc7b22ba&token=84bee53a-0a63-454b-b18d-0de7705f161d&modeltype=gpt-4-omnimodel-mini&tabs=false"
            allow="clipboard-write; clipboard-read; *;microphone *"
<<<<<<< HEAD
            width="400%"
=======
            width="200%"
>>>>>>> b9087c6f0e9a999e38b74cbbd0d33638fdc8456b
            height="450"
            frameBorder="0"
          ></iframe>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
