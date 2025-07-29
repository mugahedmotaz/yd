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

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app
NODE_ENV=development
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:4000`.

## API Endpoints

### GET /

Health check endpoint.

**Response:**
```json
{
  "message": "YouTube Downloader Backend is running!",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
  "environment": "development"
}
```

### GET /api/test

API test endpoint.

**Response:**
```json
{
  "success": true,
  "message": "API is working!",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ"
}
```

### POST /api/download

Download a YouTube video or audio.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "type": "video" // or "audio"
}
```

**Success Response:**
```json
{
  "success": true,
  "downloadUrl": "https://direct-download-url.com/file.mp4"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Deployment on Render

1. Create a new web service on Render
2. Connect your GitHub repository
3. Set the following configuration:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
   - Environment Variables:
     - `NODE_ENV`: `production`
4. Deploy the service
5. Note the deployed URL for use in the frontend

## Redeployment

After making changes to the backend:
1. Push your changes to GitHub
2. Trigger a new deployment on Render
3. Wait for the deployment to complete
4. Test the endpoints to ensure they're working

## Common Issues and Solutions

1. **Port Configuration**: Render automatically assigns a PORT environment variable. The server now properly uses this variable.
2. **youtube-dl Issues**: Added postinstall script to verify youtube-dl availability.
3. **Permission Errors**: Added specific error handling for common permission and file access issues.

## Dependencies

- `express`: Web framework
- `cors`: CORS middleware  
- `youtube-dl-exec`: YouTube downloader
- `nodemon`: Development server (dev dependency)

## Troubleshooting

### Common Issues

1. **"Cannot find package 'express'"**
   - Ensure `buildCommand: npm install` is set in render.yaml
   - Check that package.json is in the backend directory
   - Clear build cache and redeploy

2. **"youtube-dl not found" or "spawn ENOENT"**
   - This occurs when the hosting platform doesn't support youtube-dl/yt-dlp
   - Try a different hosting service (DigitalOcean, AWS, VPS)
   - Some free hosting services block external binaries

3. **"no such option" errors**
   - youtube-dl-exec may pass incompatible options to yt-dlp
   - Use minimal options in youtubedl() call
   - Ensure youtube-dl-exec version compatibility

4. **CORS errors**
   - Add your frontend domain to ALLOWED_ORIGINS
   - Check CORS middleware configuration
   - Verify frontend is using correct backend URL

5. **500 errors**
   - Check Render logs for detailed error messages
   - Verify all dependencies are installed
   - Test endpoints individually (/api/test, /)

## Testing

Test the service locally:

```bash
# Test health check
curl http://localhost:4000/

# Test API
curl http://localhost:4000/api/test

# Test download (replace with actual YouTube URL)
curl -X POST http://localhost:4000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","type":"video"}'
