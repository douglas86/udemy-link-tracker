import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the backend");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
