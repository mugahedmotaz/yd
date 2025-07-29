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

## Troubleshooting

If you encounter issues with missing dependencies when deploying to Render:

1. Make sure all files including `package.json` are committed to your repository
2. Ensure that `node_modules` is not committed to your repository (it should be in `.gitignore`)
3. Render will automatically run `npm install` during deployment
4. If issues persist, try clearing the build cache in Render dashboard

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
