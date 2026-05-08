
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("FIREBASE_SERVICE_ACCOUNT_KEY length:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length);
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log("Parsed JSON successfully. Keys:", Object.keys(parsed));
  } catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e.message);
  }
}
