import { HealthCheckResponse } from "./HealthCheckResponse.js"; 

export default interface ErrorResponse extends HealthCheckResponse {
    stack?: string;   
}

