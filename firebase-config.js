// Replace these values with your own Firebase project's config.
// Firebase Console → Project Settings → General → "Your apps" → SDK setup and configuration.
// See SETUP.md for step-by-step instructions.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// The ONLY email(s) allowed to access the admin approval page (admin.html).
// This is a convenience check in the browser, NOT real security by itself —
// the actual enforcement happens in firestore.rules. Still, set this to your
// real Google account email.
const ADMIN_EMAILS = ["youradmin@gmail.com"];
