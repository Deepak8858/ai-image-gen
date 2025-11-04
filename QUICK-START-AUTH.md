# 🚀 Quick Start Guide - Authentication Setup

Get your SaaS platform running in **5 minutes**!

## Step 1: Firebase Setup (3 minutes)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create new project** → Name it "ai-image-gen-pro"
3. **Add web app** → Click `</>` icon
4. **Enable Authentication**:
   - Go to Build → Authentication → Get Started
   - Enable "Email/Password"
   - Enable "Google"
5. **Copy your config** from the web app setup page

## Step 2: Environment Setup (1 minute)

Create `.env.local` file in your project root:

```env
GEMINI_API_KEY=your_existing_gemini_key

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 3: Install & Run (1 minute)

```bash
npm install
npm run dev
```

## Step 4: Test It! 🎉

1. Open http://localhost:3000
2. Click "Get Started"
3. Create account
4. Start generating images!

---

## 📍 Routes

- `/` - Landing page
- `/signup` - Sign up page  
- `/login` - Login page
- `/app` - Protected app (requires auth)

## 🎨 What You Get

✅ Landing page with pricing  
✅ Email/password + Google auth  
✅ Protected image generation app  
✅ Beautiful MD3 + neobrutalism UI  
✅ Loading animations  
✅ Mobile responsive  

## ❓ Issues?

See `FIREBASE-SETUP.md` for detailed troubleshooting.

**That's it! Your SaaS is live! 🚀**
