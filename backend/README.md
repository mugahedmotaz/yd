# YouTube Downloader Backend

Backend service for YouTube Downloader application built with Node.js, Express, and youtube-dl-exec.

## Features
- Download YouTube videos
- Download YouTube audio
- Extract download URLs using youtube-dl-exec

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. For production, start the server:
   ```
   npm start
   ```

## API Endpoints

### POST /api/download

Download a YouTube video or audio.

**Request Body:**
```json
{
  "url": "YouTube video URL",
  "type": "video|audio"
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "Direct download URL"
}
```

## Deployment

This backend is configured for deployment on Render.com. Simply connect your GitHub repository to Render and it will automatically deploy using the render.yaml configuration.

## Environment Variables

- `PORT`: Server port (default: 4000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., https://your-frontend.vercel.app,https://your-frontend.netlify.app)

## Dependencies

- express
- cors
- youtube-dl-exec
