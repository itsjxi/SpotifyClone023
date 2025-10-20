# Spotify API Setup Guide

## 1. Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the details:
   - **App Name**: Your Spotify Clone
   - **App Description**: A Spotify clone built with React
   - **Website**: http://localhost:5173 (for development)
   - **Redirect URI**: http://localhost:5173/callback

## 2. Get Your Credentials

1. After creating the app, click on it to open settings
2. Copy your **Client ID**
3. Click "Show Client Secret" and copy your **Client Secret**

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your credentials:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_actual_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_actual_client_secret
   VITE_REDIRECT_URI=http://localhost:5173/callback
   ```

## 4. App Settings in Spotify Dashboard

Make sure your Spotify app has these settings:

### Redirect URIs:
- Development: `http://localhost:5173/callback`
- Production: `https://yourdomain.com/callback`

### Scopes (automatically requested):
- `user-read-private` - Read user profile
- `user-read-email` - Read user email
- `user-read-playback-state` - Read playback state
- `user-modify-playback-state` - Control playback
- `user-read-currently-playing` - Read currently playing
- `playlist-read-private` - Read private playlists
- `playlist-read-collaborative` - Read collaborative playlists
- `playlist-modify-public` - Modify public playlists
- `playlist-modify-private` - Modify private playlists
- `user-library-read` - Read saved tracks
- `user-library-modify` - Modify saved tracks
- `user-top-read` - Read top tracks and artists
- `user-read-recently-played` - Read recently played

## 5. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:5173`
3. Click "Connect with Spotify"
4. You should be redirected to Spotify's authorization page
5. After granting permissions, you'll be redirected back to your app

## 6. Production Deployment

When deploying to production:

1. Update your Spotify app's redirect URI to your production domain
2. Update `VITE_REDIRECT_URI` in your production environment variables
3. Make sure your domain is added to the Spotify app settings

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Make sure the redirect URI in your Spotify app matches exactly with `VITE_REDIRECT_URI`
   - Check for trailing slashes and protocol (http vs https)

2. **"Invalid client"**
   - Verify your Client ID and Client Secret are correct
   - Make sure there are no extra spaces in your environment variables

3. **"Access denied"**
   - Check that your app is not in development mode restrictions
   - Verify the user has access to your Spotify app

### Development Tips:

- Use Spotify's Web Playback SDK for actual music playback
- Implement token refresh logic for long-running sessions
- Handle rate limiting (429 responses) from Spotify API
- Cache user data to reduce API calls

## Next Steps

After successful authentication, you can:
- Fetch user's playlists
- Get user's saved tracks
- Search for music
- Control playback (requires Spotify Premium)
- Create and modify playlists