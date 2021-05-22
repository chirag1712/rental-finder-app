const express = require('express');

const app = express();

//body parser
app.use(express.json( { extended: false } ));

// simple route
app.get("/", (_, res) => {
    res.json({ message: "Hello, welcome to our CS348 project." });
});

// require all routes here
require("./app/routes/student.routes.js")(app);

// listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
