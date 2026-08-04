// Replace these values with your own Firebase project's config.
// Firebase Console → Project Settings → General → "Your apps" → SDK setup and configuration.
// See SETUP.md for step-by-step instructions.

const firebaseConfig = {
  apiKey: "AIzaSyAM73VBxYMFaCUdd0SHQu7OSU4kbMBJL4k",
  authDomain: "comingsoonincity-65a7b.firebaseapp.com",
  projectId: "comingsoonincity-65a7b",
  storageBucket: "comingsoonincity-65a7b.firebasestorage.app",
  messagingSenderId: "801805033349",
  appId: "1:801805033349:web:4a8caf90aee2dcd275aeec"
};

// The ONLY email(s) allowed to access the admin approval page (admin.html).
// This is a convenience check in the browser, NOT real security by itself —
// the actual enforcement happens in firestore.rules. Still, set this to your
// real Google account email.
const ADMIN_EMAILS = ["comingsoonincity@gmail.com"];
