# Setting up admin-approved connect access

The board itself is public — anyone can browse listings. But clicking **Start**
on a listing (to reach a business's YouTube/Instagram/WhatsApp) now requires
the visitor to sign in with Google and be approved by you first. Approvals
happen on a new `admin.html` page.

## 1. Create a Firebase project (free)

1. Go to https://console.firebase.google.com and click **Add project**.
2. Name it anything (e.g. `comingsoonincity`). You can skip Google Analytics.
3. Once created, click the **</> (Web)** icon to register a web app.
   Give it a nickname, you don't need Firebase Hosting for this.
4. Firebase will show you a `firebaseConfig` object — copy it.

## 2. Fill in `firebase-config.js`

Open `firebase-config.js` in this folder and replace the placeholder values
with the ones Firebase gave you:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Then set `ADMIN_EMAILS` to your own Google account email — this is the account
that will be allowed onto the `admin.html` approval page.

## 3. Turn on Google Sign-In

In the Firebase Console: **Build → Authentication → Get started → Sign-in method
→ Google → Enable**. Set a support email (yours) and save.

## 4. Create the Firestore database

**Build → Firestore Database → Create database.** Choose a region close to you,
and start in **production mode** (the rules file below handles security).

## 5. Apply the security rules

In **Firestore Database → Rules**, replace the default rules with the contents
of `firestore.rules` in this folder — and make sure the email inside it
matches your real admin email in two places (it currently says
`youradmin@gmail.com`).

Click **Publish**.

## 6. Try it out

- Open `index.html` — the board itself is visible right away.
- Click **Start** on any listing — you'll be asked to sign in with Google,
  then see a "waiting on approval" message inside that same popup.
- Open `admin.html` and sign in with your **admin** Google account — you'll
  see that request under "Pending" and can click **Approve**.
- Go back and click **Start** on a listing again (or wait a moment — it
  updates live) — the YouTube/Instagram/WhatsApp options now unlock for that
  account, on every listing, not just the one they first clicked.

## Notes

- People must sign in with the *same* Google account each time — access is
  tied to their Google account, not a password.
- To remove someone's access later, go to `admin.html` and click **Revoke**
  next to their name under "Approved".
- The real security boundary is `firestore.rules`, not the JavaScript in
  `auth.js`/`admin.js` — even if someone edited the page's code in their
  browser, they still couldn't grant themselves approval, because only your
  admin account is allowed to write the `approved` status server-side.
- This uses Firebase's free "Spark" plan, which comfortably covers a small
  private directory like this one.
