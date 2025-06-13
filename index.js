const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

// Load service account
const serviceAccount = require("/etc/secrets/service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const { token, data } = req.body;

  if (!token || !data) {
    return res.status(400).send({ error: "Token and data required" });
  }

  const message = {
    token,
    data, // must be key-value strings only
  };

  try {
    const response = await admin.messaging().send(message);
    return res.status(200).send({ success: true, response });
  } catch (error) {
    console.error("FCM error:", error);
    return res.status(500).send({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("FCM Trigger Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
