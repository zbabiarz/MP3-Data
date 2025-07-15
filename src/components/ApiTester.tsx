"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle } from "lucide-react";
import ResultDisplay from "./ResultDisplay";

interface ApiResponse {
  duration?: number;
  error?: string;
  status?: number;
  message?: string;
}

export default function ApiTester() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/get-audio-duration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      setResponse({
        ...data,
        status: res.status,
      });
    } catch (error) {
      setResponse({
        error: "Failed to connect to API",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        status: 500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>MP3 Duration API Tester</CardTitle>
          <CardDescription>
            Test the API endpoint that extracts duration from MP3 files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                MP3 URL
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/audio.mp3"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Processing..." : "Get Duration"}
            </Button>
          </form>

          {response && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Response</h3>
              <ResultDisplay
                loading={isLoading}
                error={
                  response.error ||
                  (response.status && response.status >= 400
                    ? response.message || "An error occurred"
                    : "")
                }
                duration={response.duration}
                rawResponse={JSON.stringify(response, null, 2)}
              />
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">API Usage</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Send a POST request to{" "}
                  <code className="bg-background px-1 py-0.5 rounded">
                    /api/get-audio-duration
                  </code>{" "}
                  with a JSON body containing the URL of an MP3 file:
                </p>
                <pre className="bg-background p-3 rounded-md mt-2 overflow-x-auto text-xs">
                  {JSON.stringify(
                    { url: "https://example.com/audio.mp3" },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Supports public MP3 URLs only
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
