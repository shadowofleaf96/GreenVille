const { app } = require("./app");

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port http://127.0.0.1:3000/");
});
