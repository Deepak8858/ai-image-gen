# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for AI Image Gen Pro.

## Prerequisites

- A Google account
- Node.js 18+ installed
- Your Gemini API key already configured

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "ai-image-gen-pro")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **web icon** (`</>`) to add a web app
2. Give your app a nickname (e.g., "AI Image Gen Pro Web")
3. Click **"Register app"**
4. You'll see your Firebase configuration object - **keep this page open**

## Step 3: Enable Authentication Methods

1. In the Firebase Console, go to **Build** > **Authentication**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" toggle, then "Save"
   - **Google**: Click "Enable" toggle, enter your project support email, then "Save"

## Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase configuration from Step 2:
   ```env
   # Gemini AI API Key (already configured)
   GEMINI_API_KEY=your_existing_gemini_key
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 5: Install Dependencies

```bash
npm install
```

This will install Firebase and all required dependencies.

## Step 6: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your landing page!

## Testing Authentication

1. Navigate to `http://localhost:3000`
2. Click **"Get Started"** or **"Sign In"**
3. Create a new account with email/password or use Google Sign-In
4. After successful login, you'll be redirected to the image generation app at `/app`

## Authentication Flow

```
Landing Page (/) → Sign Up (/signup) or Login (/login) → App (/app)
                                                            ↓
                                                   Protected Route
                                                   (Auth Required)
```

## Security Rules (Optional)

For production, consider adding Firebase Security Rules:

1. Go to **Build** > **Authentication** > **Settings**
2. Under **Authorized domains**, add your production domain
3. Configure password policies and user limits as needed

## Troubleshooting

### "Firebase not installed" error
Run: `npm install firebase`

### Authentication not working
- Check that all environment variables are correctly set
- Ensure you've enabled Email/Password and Google auth in Firebase Console
- Clear browser cache and try again

### Redirect not working after login
- Make sure `/app` route exists
- Check browser console for errors
- Verify AuthProvider is wrapping your app in `layout.tsx`

## Features Included

✅ Email/Password authentication  
✅ Google OAuth sign-in  
✅ Protected routes (redirects to login if not authenticated)  
✅ Persistent authentication state  
✅ Beautiful Material Design 3 + Neobrutalism UI  
✅ Loading animations and transitions  
✅ Password reset functionality (email link)

## Support

If you encounter issues:
1. Check the [Firebase Documentation](https://firebase.google.com/docs/auth/web/start)
2. Verify your environment variables are correct
3. Check browser developer console for detailed error messages

---

**Ready to create amazing AI images!** 🎨
