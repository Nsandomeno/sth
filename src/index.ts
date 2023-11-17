import app from "./app.js";
import * as dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
    console.log("Application started up and listening on port: ", port);
});
