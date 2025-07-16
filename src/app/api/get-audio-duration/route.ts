import { NextRequest, NextResponse } from "next/server";
import { parseBuffer } from "music-metadata";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { url } = body;

    // Validate the URL parameter
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // Fetch the audio file
    let response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "MP3-Duration-API/1.0",
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to fetch audio file",
          message: error instanceof Error ? error.message : "Network error",
        },
        { status: 500 },
      );
    }

    // Check if the request was successful
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Audio file not found" },
          { status: 404 },
        );
      }
      if (response.status === 403) {
        return NextResponse.json(
          { error: "Access denied to audio file" },
          { status: 403 },
        );
      }
      return NextResponse.json(
        {
          error: `Failed to fetch audio file: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    // Get the content type
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("audio/")) {
      return NextResponse.json(
        { error: "URL does not point to an audio file" },
        { status: 415 },
      );
    }

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse metadata to get duration
    try {
      const metadata = await parseBuffer(buffer);
      const duration = metadata.format.duration;

      if (duration === undefined) {
        return NextResponse.json(
          { error: "Could not extract duration from audio file" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { duration: Math.round(duration * 100) / 100 }, // Round to 2 decimal places
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      );
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to parse audio metadata",
          message: error instanceof Error ? error.message : "Parsing error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
