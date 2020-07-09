import { ExtensionUrl, Server } from '../app/core/extension-url';

// this var may be injected via index.html and server-side include
const injectedEnv = window['INJECTED_ENVIRONMENT'];
let seedEnv: Environment;

if (!injectedEnv) {
  // tslint:disable-next-line:no-console
  console.warn(
    'DASHBOARD DEFAULT DEVELOPMENT ENV ACTIVE - DID YOU FORGET TO INJECT A RUNTIME ENV?'
  );
  seedEnv = {
    serviceInstanceId: '73047820-8d36-4323-bf2b-77dc887a707e',
    token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQOG5VNGpDdDM0UXhqenExdXNhMXItZjVXb2VWeWp3SXo1RTZLQUxzN2FFIn0.eyJleHAiOjE1OTQ0MDY3MzIsImlhdCI6MTU5NDMyMDM1NywiYXV0aF90aW1lIjoxNTk0MzIwMzMyLCJqdGkiOiIyNmJmZjM1Yy02ZGZmLTQ3YTQtYTYzOS01MmZhYzI1OWY5MDYiLCJpc3MiOiJodHRwczovL3Nzby5zeXN0ZW0uY2YuaG9iLmxvY2FsL2F1dGgvcmVhbG1zL1RpbUFHIiwic3ViIjoiYmQyMDA1NGMtNTQ5OC00MzBmLWI5NTItZDc0NGVlYTA4NGZkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG9nLW1ldHJpYy1kYXNoYm9hcmQiLCJzZXNzaW9uX3N0YXRlIjoiNjVmZjRkMGItYWQ3My00MDgwLWE5YzQtYTgxNzIwYmZlOTUxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ0aW0tdXNlciJdfSwic2NvcGUiOiIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXJ0bmVyc2Nob2xsZUBzY2hvbGxlLm15IiwiZW1haWwiOiJwYXJ0bmVyc2Nob2xsZUBzY2hvbGxlLm15In0.GAgJabfMe0MF0CjBJCl4VmeNtcNWdHiB9Q9_8eHg4EzyCBP_o6EM-l4Lx-mAm3hxjJ89KOH56cPDTIoeXllZZN7tebHqOkepe_daTD8hFHFqL7VBpFhF9g4-Nsk5fQb84brCFsgiWhOy_WA7O3fpxWMWU4hbFFj3pcHm1ldn0bgYy3yGt-6rb6YkwI6A0wM0Xagwbk9CCr0b35DJD-TO_KZ0bS1GXqg8WvMgoVAgaQJXVUDocYpuNzadFfbR_i_nPIqNokYECzKyTC_TS0DEUkciu2GqbNSKgUJ4BVnnxm5IYzz25IuCA76e0YlEmcvMy3WnOUZ6yxR2FVboCYRJxw',

    baseUrls: {
      serviceBrokerUrl: 'https://osb-log-metric-test.system.cf.hob.local'
    },
    production: false,
    customEndpoints: [
      //{ url: 'https://osb-log-metric-dashboard-backend-test.system.cf.hob.local', identifier: 'log-metric-backend' },
      //{ url: 'https://log-metric-backend-feature.system.cf.hob.local', identifier: 'log-metric-backend' },
      //{ url: 'http://localhost:8080', identifier: 'log-metric-backend' },
      { url: 'https://osb-log-metric-dashboard-backend-keycloak-test.system.cf.hob.local', identifier: 'log-metric-backend' },
      { url: 'http://localhost:8081', identifier: 'osb-backup-manager' }
    ],
    ui: {
      title: 'Service Broker Panel',

      logoSrc: './assets/core/sb-white.svg'
    }
  } as Environment;
} else {
  seedEnv = {
    serviceInstanceId: '/*[[${serviceInstanceId}]]*/',
    token: '/*[[${token}]]*/',
    baseUrls: {
      serviceBrokerUrl: '/*[[${endpointUrl}]]*/'
    },
    production: true,
    ui: {
      title: 'Service Broker Panel',
      logoSrc: './assets/core/sb-white.svg'
    }
  } as Environment;
}

export interface Environment {
  serviceInstanceId: string;
  token: string;
  extensionUrls: ExtensionUrl;
  production: boolean;
  baseUrls: {
    serviceBrokerUrl: string;
  };
  customEndpoints: Array<Server>;
  ui: {
    title: string;
    logoSrc: string;
  };
}

// we use quoutes here because that makes it easier to copy config to nginx.conf or cf manifest files
// tslint:disable:quotemark

// overwrite default env with injected vars
export const environment: Environment = Object.assign({}, seedEnv, injectedEnv);
