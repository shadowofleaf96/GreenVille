import "dotenv/config";
import app from "./app.js";
import "./config/database.js";

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${process.env.BACKEND_URL}`);
});
