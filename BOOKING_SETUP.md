# Google Calendar Booking System Setup Guide

## Overview
This booking system allows visitors to book training sessions with Oren Levy through Google Calendar integration. The system automatically creates calendar events with Google Meet links and sends email invites to both the trainer and client.

## Features
- ✅ Date and time selection with real-time availability
- ✅ Automatic Google Calendar event creation
- ✅ Google Meet integration for virtual sessions
- ✅ Email notifications to trainer and client
- ✅ Hebrew RTL interface
- ✅ Mobile-responsive design

## Setup Instructions

### 1. Google Cloud Console Setup

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

#### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Levy's Fitness Booking"
   - User support email: `training.program.levys@gmail.com`
   - Developer contact information: `training.program.levys@gmail.com`
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
5. Add test users:
   - Add `training.program.levys@gmail.com` as a test user
6. **Important**: Keep the app in "Testing" mode for development

#### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3001/api/google/oauth/callback`
   - `https://yourdomain.com/api/google/oauth/callback` (for production)
5. Copy the Client ID and Client Secret

### 2. Environment Variables

Create or update your `.env.local` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/oauth/callback

# Trainer Configuration
TRAINER_EMAIL=training.program.levys@gmail.com
TRAINER_CALENDAR_ID=primary

# Site Configuration
SITE_TIMEZONE=Asia/Jerusalem
BASE_URL=http://localhost:3001
```

### 3. Trainer Calendar Setup

#### Step 1: Connect Trainer Account
1. Start the development server: `npm run dev`
2. Visit: `http://localhost:3001/api/google/oauth/start`
3. Click the authentication link
4. Sign in with `training.program.levys@gmail.com`
5. Grant calendar permissions

#### Step 2: Set Up Availability Events
1. Open Google Calendar
2. Create recurring events titled "Availability" for working hours
3. Example: "Availability" event from 9:00 AM to 6:00 PM on weekdays
4. These events define when the trainer is available for bookings

### 4. Testing the System

#### Test the Booking Flow
1. Visit the website: `http://localhost:3001`
2. Scroll to the contact section
3. Select a date and time
4. Fill in client information
5. Submit the booking
6. Check that:
   - Calendar event is created
   - Google Meet link is generated
   - Email invites are sent

## How It Works

### 1. Availability Checking
- System queries Google Calendar for "Availability" events
- Checks for conflicts with existing events
- Returns available 30-minute slots

### 2. Booking Creation
- Creates Google Calendar event with client details
- Generates Google Meet link
- Sends email invites to trainer and client
- Includes reminders (1 day and 30 minutes before)

### 3. Event Details
- Event title: "אימון אישי - [Client Name]"
- Description includes client contact info and Meet link
- 30-minute duration
- Automatic reminders

## Troubleshooting

### Common Issues

#### 1. "Access blocked" Error
- Ensure the app is in "Testing" mode
- Add your email as a test user in OAuth consent screen
- Check that the redirect URI matches exactly

#### 2. No Available Slots
- Verify "Availability" events exist in Google Calendar
- Check that events are titled exactly "Availability"
- Ensure events cover the desired time range

#### 3. Authentication Errors
- Verify environment variables are set correctly
- Check that Google Calendar API is enabled
- Ensure OAuth credentials are properly configured

### Debug Endpoints

- Test OAuth: `http://localhost:3001/api/google/oauth/start`
- Check availability: `http://localhost:3001/api/availability?date=2024-01-15`

## Production Deployment

### 1. Update Environment Variables
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/google/oauth/callback
BASE_URL=https://yourdomain.com
```

### 2. Update OAuth Consent Screen
- Add production domain to authorized redirect URIs
- Consider publishing the app (requires Google verification)

### 3. Database Integration
- Replace in-memory token storage with a database
- Use Prisma or similar ORM for production

## Security Considerations

- Store tokens securely in production
- Implement proper session management
- Add rate limiting for API endpoints
- Validate all user inputs
- Use HTTPS in production

## Support

For issues or questions, contact the development team or refer to the Google Calendar API documentation.
