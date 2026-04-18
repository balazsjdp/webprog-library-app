import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const serviceName = process.env.OTEL_SERVICE_NAME ?? 'konyvtar-backend';

if (endpoint && process.env.NODE_ENV !== 'test') {
  const sdk = new NodeSDK({
    resource: new Resource({ [ATTR_SERVICE_NAME]: serviceName }),
    traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
    // Metrics are auto-configured from OTEL_METRICS_EXPORTER + OTEL_EXPORTER_OTLP_METRICS_ENDPOINT
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk.shutdown().finally(() => process.exit(0));
  });
}
