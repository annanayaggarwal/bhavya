require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');

let firebaseApp = null;

function initializeFirebase() {
  // Check if Firebase app is already initialized
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  try {
    // Validate required environment variables
    if (!process.env.FIREBASE_STORAGE_BUCKET) {
      throw new Error('FIREBASE_STORAGE_BUCKET is not defined');
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not defined');
    }

    // Read and parse service account credentials
    const serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));

    // Initialize Firebase app
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    console.log('Firebase app initialized successfully');

    // Optional: Verify storage bucket connection
    const bucket = admin.storage().bucket();
    bucket.getMetadata()
      .then(() => console.log(`Connected to bucket: ${process.env.FIREBASE_STORAGE_BUCKET}`))
      .catch((error) => console.error('Bucket connection error:', error));

    return firebaseApp;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

module.exports = {
  initializeFirebase,
  admin
};