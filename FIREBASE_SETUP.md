# 🔥 Firebase Authentication Setup Guide

## 🚀 **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "todo-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## ⚙️ **Step 2: Enable Authentication**

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 🔑 **Step 3: Get Your Config**

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "todo-web-app")
6. Copy the config object

## 📝 **Step 4: Update Firebase Config**

Replace the placeholder values in `lib/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## 🧪 **Step 5: Test Authentication**

1. Run your app: `npm run dev`
2. Go to `/signup` to create a new account
3. Go to `/login` to sign in
4. Test the authentication flow

## 🔒 **Security Rules (Optional)**

If you plan to use Firestore later, you can set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎯 **What You Get**

✅ **Real User Authentication** - No more demo credentials  
✅ **Secure Password Storage** - Firebase handles security  
✅ **Email Verification** - Built-in email verification  
✅ **Password Reset** - Users can reset forgotten passwords  
✅ **Session Management** - Automatic login state management  
✅ **Production Ready** - Used by major companies worldwide  

## 🚨 **Important Notes**

- **Never commit your Firebase config** to public repositories
- **Use environment variables** for production deployments
- **Enable email verification** for production apps
- **Set up proper security rules** if using Firestore

## 🆘 **Need Help?**

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

---

**Your app is now ready for real authentication! 🎉**
