import React from "react";
import ApiTester from "@/components/ApiTester";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            MP3 Duration API Tester
          </CardTitle>
          <CardDescription>
            Test the API endpoint that extracts duration from MP3 files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiTester />
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>API Endpoint: POST /api/get-audio-duration</p>
        <p className="mt-2">Accepts JSON body with a URL to an MP3 file</p>
      </footer>
    </main>
  );
}
