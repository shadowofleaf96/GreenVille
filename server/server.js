const app = require("./app");

require("dotenv").config();

require("./config/database")
const port = process.env.PORT || 3000;



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});