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
    token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQOG5VNGpDdDM0UXhqenExdXNhMXItZjVXb2VWeWp3SXo1RTZLQUxzN2FFIn0.eyJleHAiOjE1OTQxOTM4NjYsImlhdCI6MTU5NDE1Nzg2NiwianRpIjoiYTg0MjViNDEtOTRlNS00YzM5LTliNDQtMWE0YTA3ZTdlNGEwIiwiaXNzIjoiaHR0cHM6Ly9zc28uc3lzdGVtLmNmLmhvYi5sb2NhbC9hdXRoL3JlYWxtcy9UaW1BRyIsInN1YiI6IjU5ZmQxNzYyLWYxMDctNDRhYy04NTIyLTYwMGEzMDUxYmQyZCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImxvZy1tZXRyaWMtZGFzaGJvYXJkIiwic2Vzc2lvbl9zdGF0ZSI6IjIwZjcwMDA4LWIxNGQtNDM3Ny1hZjRjLWU3ODFkMjQ3OGM4MiIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidGltLXVzZXIiLCJ0aW0tYWRtaW4iXX0sInNjb3BlIjoidGltYWciLCJyb2xlcyI6WyJ0aW0tdXNlciIsInRpbS1hZG1pbiJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJtbWFobGVyIiwiZW1haWwiOiJtbWFobGVyQGV2b2lsYS5kZSJ9.KCEVMWGS__MJe2p5ZX52xua7lcMvfoV-mirLJg7u70_osgmrqKRqtuBPl92s-WXHKopLLuW5uDjSpgejbcKAhNEN__rFg60HldvenVdBsoISif5CrSE3Ivi0VEiH9gwZjy10rP9M9gZjQ8wP0fP0-in8xhIyPNWEJC4DZBRd1wXLMwywNngmYobPbFdFlWBXdLlX-u855YGHIyh0p2GIuGSNn_NZZCETHTR7w721zVjSbrisQrHmQEXRL9Ht3nYf9wXXeQrIJRXTS7fm_jXA3adyluqNzPruIGd76P-hH3ROktUKeTyQh-KWWZMPcpmyXpGx5d6kIkmIHlRRyCFYBw',

    baseUrls: {
      serviceBrokerUrl: 'https://osb-log-metric-test.system.cf.hob.local'
    },
    production: false,
    customEndpoints: [
      //{ url: 'https://osb-log-metric-dashboard-backend-test.system.cf.hob.local', identifier: 'log-metric-backend' },
      //{ url: 'https://log-metric-backend-feature.system.cf.hob.local', identifier: 'log-metric-backend' },
      //{ url: 'http://localhost:8081', identifier: 'log-metric-backend' },
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
