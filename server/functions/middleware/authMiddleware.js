const admin = require("firebase-admin");

// When deployed to Firebase, initializeApp() with no arguments
// automatically finds the project's credentials.
admin.initializeApp();

const checkAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const token = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Add user info (like uid, email) to the request object
      next(); // Proceed to the next function
    } catch (error) {
      console.error("Error while verifying Firebase ID token:", error);
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }
};

module.exports = checkAuth;
