const admin = require('firebase-admin');

// IMPORTANT: You need to generate a private key file for your service account
// Go to Firebase Console > Project Settings > Service Accounts > Generate new private key
// This will download a JSON file. Rename it to 'serviceAccountKey.json' and place it in your 'server' folder.
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const checkAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Add user info to the request object
      next(); // Proceed to the next function
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
};

module.exports = checkAuth;
