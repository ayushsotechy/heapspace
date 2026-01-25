import client from "prom-client"

export const register = new client.Registry();

client.collectDefaultMetrics({
    register,
    prefix: "heapspace"
})
export const httpRequestCounter = new client.Counter({
    name: "heapsace_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"]
});
export const httpRequestDuration = new client.Histogram({
    name: "heapsace_http_request_duration_seconds",
    help: "HTTP request latency",
    labelNames: ["method", "route"],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);