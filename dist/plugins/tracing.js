import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // Endpoint OTLP HTTP do Uptrace
});
const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
});
try {
    sdk.start();
    console.log('✅ OpenTelemetry inicializado');
}
catch (err) {
    console.error('❌ Erro ao iniciar OpenTelemetry', err);
}
