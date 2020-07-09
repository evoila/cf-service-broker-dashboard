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
    token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQOG5VNGpDdDM0UXhqenExdXNhMXItZjVXb2VWeWp3SXo1RTZLQUxzN2FFIn0.eyJleHAiOjE1OTQ0MTMyNTUsImlhdCI6MTU5NDMyNjg1NSwianRpIjoiYWI2NDgwZGYtMzdlMC00ZTk5LWJjYjUtYThlNjM2NzNlMmJkIiwiaXNzIjoiaHR0cHM6Ly9zc28uc3lzdGVtLmNmLmhvYi5sb2NhbC9hdXRoL3JlYWxtcy9UaW1BRyIsInN1YiI6IjU5ZmQxNzYyLWYxMDctNDRhYy04NTIyLTYwMGEzMDUxYmQyZCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImxvZy1tZXRyaWMtZGFzaGJvYXJkIiwic2Vzc2lvbl9zdGF0ZSI6IjkyM2E1YzY3LTFmZmYtNDYzYy1hMWYzLTViMjcxZTdmZThhYSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidGltLXVzZXIiLCJ0aW0tYWRtaW4iXX0sInNjb3BlIjoidGltYWciLCJyb2xlcyI6WyJ0aW0tdXNlciIsInRpbS1hZG1pbiJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJtbWFobGVyIiwiZW1haWwiOiJtbWFobGVyQGV2b2lsYS5kZSJ9.cceq0qomT9g5lfPKIkDVeaNmm-bAj0WdMoMA-NCYBgj1hDJcR_3wCYj8Uus94JRbtT8HOUEFrzGM8NKUrD41UNaUoPMaIM26l_7L-daqleOH5CnZ9sJk6dlCg-UHz9McpZ8XBGmGGD2Z6K5ce8atg0hfVlInXRgsAfcaSEKtQF0hhZ_fzzbM_83ZKGNqzBCC89hhYM0uJK9zSzVJSsaYPPo_jXkOtf5K5aOhcRByyOJ4YQUsBp_Zcv0bc1AewFUHPcxiFk06cZjcwEneKlLnOsV59ZsuFPz_2jPxDoIvlwm4hgg3HhGKn08bsoRHmyaw5OCVh-L0xD5Qxz4PXcWXKw',

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
