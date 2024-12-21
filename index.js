require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const { Form, Elder } = require("./config");

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Utility function for error handling
function handleError(res, error, customMessage) {
  console.error(customMessage, error);
  res.status(500).send({ msg: customMessage, error: error.message });
}

// Middleware to validate the request body
function validateRequestBody(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({ msg: "Invalid Request: No Data Sent" });
  }
  next();
}

// Get all documents
app.get("/", async (req, res) => {
  try {
    const snapshot = await Form.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(list);
  } catch (error) {
    handleError(res, error, "Failed to Fetch Data");
  }
});

// Add a new document
app.post("/create", validateRequestBody, async (req, res) => {
  try {
    const data = req.body;
    await Form.add(data);
    res.status(200).send({ msg: "Form Added Successfully" });
  } catch (error) {
    handleError(res, error, "Failed to Add Data");
  }
});
app.post("/elder", validateRequestBody, async (req, res) => {
  try {
    const data = req.body;
    await Elder.add(data);
    res.status(200).send({ msg: " Elder Details Added Successfully" });
  } catch (error) {
    handleError(res, error, "Failed to Add Data");
  }
});

// Update an existing document
app.put("/update", validateRequestBody, async (req, res) => {
  try {
    const { id, ...data } = req.body;
    if (!id) {
      return res.status(400).send({ msg: "Invalid Request: Missing ID" });
    }
    await Form.doc(id).update(data);
    res.status(200).send({ msg: "Form Updated Successfully" });
  } catch (error) {
    handleError(res, error, "Failed to Update Data");
  }
});

// Delete a document
app.delete("/delete", validateRequestBody, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({ msg: "Invalid Request: Missing ID" });
    }
    await Form.doc(id).delete();
    res.status(200).send({ msg: "Form Data Deleted Successfully" });
  } catch (error) {
    handleError(res, error, "Failed to Delete Data");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
