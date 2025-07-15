"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, Copy, AlertCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ResultDisplayProps {
  loading?: boolean;
  error?: string;
  duration?: number;
  rawResponse?: string;
}

export default function ResultDisplay({
  loading = false,
  error = "",
  duration = null,
  rawResponse = "",
}: ResultDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const formatTime = (seconds: number): string => {
    if (!seconds && seconds !== 0) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = () => {
    if (!rawResponse) return;
    navigator.clipboard.writeText(rawResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full bg-card border shadow-sm">
      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Processing audio file...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <Badge variant="destructive" className="mr-2">
                Error
              </Badge>
              <h3 className="font-medium">Failed to get audio duration</h3>
            </div>
            <div className="flex items-start rounded-md bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : duration !== null ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary mr-2"
              >
                Success
              </Badge>
              <h3 className="font-medium">Audio Duration</h3>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-2xl font-semibold">
                  {formatTime(duration)}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({duration.toFixed(2)} seconds)
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground">
                  Raw response: {rawResponse}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!rawResponse}
                        className="ml-2"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span className="ml-1">
                          {copied ? "Copied" : "Copy"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy raw JSON response</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Clock className="h-10 w-10 mb-2 opacity-20" />
            <p>Submit an MP3 URL to see the audio duration</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
