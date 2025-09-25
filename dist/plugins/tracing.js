"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const traceExporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // Endpoint OTLP HTTP do Uptrace
});
const sdk = new sdk_node_1.NodeSDK({
    traceExporter,
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
});
try {
    sdk.start();
    console.log('✅ OpenTelemetry inicializado');
}
catch (err) {
    console.error('❌ Erro ao iniciar OpenTelemetry', err);
}
