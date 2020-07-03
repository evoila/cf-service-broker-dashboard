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
    token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVZ1l6ZmRjYU8ydFJsZzBZY1M0OExEaDJLc283TW1OVjU2SUxERTZWekZjIn0.eyJleHAiOjE1OTM3NTYwMTQsImlhdCI6MTU5MzcyMDAxNCwianRpIjoiNmMxMGJmZjktZjYzZS00MzIyLTg2Y2UtYjVjM2YxYmVjZTNlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL1RpbUFHIiwic3ViIjoiODgxODk2ZGItYjcxMi00NWVlLWI3ZDItZDg2NWU5MGU1OWEwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG9nLW1ldHJpYy1kYXNoYm9hcmQiLCJzZXNzaW9uX3N0YXRlIjoiNDQ4MWU2ZjMtYWQ3ZC00MmZkLWEwZmYtNGZkNGE4YzIzZGMwIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ0aW0tdXNlciJdfSwic2NvcGUiOiJ0aW1hZyIsInJvbGVzIjpbInRpbS11c2VyIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImpoZXlsIn0.NSkO8iYO4lUnndGh6D_EaUij3HwvtrxZbtxGQxOVXvCKRRR_UDmvurNfhgXj71qkzefcyZF4TT8WgBLGYCk1UXcHfRQJffVbvrDACF_VebsLPXU0b-pHDsHgRNvVGSHPcMD7rp8nb1HDLGTnFOdA3dRnA6hSi7oJBKE60dZfsQfVUBJOXNteH1NaGq8Q3BXc6tEYLZWlqJtxF5iTMErFvrTXCyXmBQCGI0_nF1lUaZZI-AFUts_NXp79R43nYoYidflrwWbkcyQWJHuMjlpH1Q9pVdhKi_qe7ohOXikup2gQmy-rvEZsNMRtpZN7Xc74CXdK3l8PQo8LtgwtokZ1iQ',

    baseUrls: {
      serviceBrokerUrl: 'https://osb-log-metric-test.system.cf.hob.local'
    },
    production: false,
    customEndpoints: [
      //{ url: 'https://osb-log-metric-dashboard-backend-test.system.cf.hob.local', identifier: 'log-metric-backend' },
      //{ url: 'https://log-metric-backend-feature.system.cf.hob.local', identifier: 'log-metric-backend' },
      { url: 'http://localhost:8081', identifier: 'log-metric-backend' },
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
