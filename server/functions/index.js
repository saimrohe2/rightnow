const { onRequest } = require("firebase-functions/v2/https");
const app = require("./app");

// This exports your Express app using the new (v2) syntax.
// Runtime options like memory are now passed as the first argument.
exports.api = onRequest({ memory: "256MiB" }, app);
