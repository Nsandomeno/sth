import express from 'express';
import routes from "./routes/index.js";
import * as middleware from "./middleware.js";
import { HealthCheckResponse } from './interfaces/HealthCheckResponse.js';

const app = express();

app.get<{}, HealthCheckResponse>("/", (req, res) => {
    res.json({
        status: "healthy"
    })
});

app.use("/api/v1", routes);
app.use(middleware.notFound);
app.use(middleware.errorHandler);

export default app;
