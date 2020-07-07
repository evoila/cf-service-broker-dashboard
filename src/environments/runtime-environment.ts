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
    token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQOG5VNGpDdDM0UXhqenExdXNhMXItZjVXb2VWeWp3SXo1RTZLQUxzN2FFIn0.eyJleHAiOjE1OTQwODYxNDEsImlhdCI6MTU5NDA1MDE0MSwianRpIjoiNTg1YTQ0NDktYzAxZS00ZmFiLTkxZjYtYTg1ZTUxYTc3OWMwIiwiaXNzIjoiaHR0cHM6Ly9zc28uc3lzdGVtLmNmLmhvYi5sb2NhbC9hdXRoL3JlYWxtcy9UaW1BRyIsInN1YiI6Ijg3MjM1ZTE2LTU0N2QtNDY1NS1iYTk1LTlmYjhmMmRhODdhMyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImxvZy1tZXRyaWMtZGFzaGJvYXJkIiwic2Vzc2lvbl9zdGF0ZSI6IjIyMjNiNDllLWI4NGQtNGVhZS04MDg4LWFkMjc2NDQ1MjI4MCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidGltLXVzZXIiLCJ0aW0tYWRtaW4iXX0sInNjb3BlIjoidGltYWciLCJyb2xlcyI6WyJ0aW0tdXNlciIsInRpbS1hZG1pbiJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqaGV5bCIsImVtYWlsIjoiamhleWxAZXZvaWxhLmRlIn0.drrOPwTgpwE1YP-9JuId-dXR5wxc3uT5-D86HfL5nYgN2iWr5UpVxAuFxtpzETnAaUEOqoxDoP_Vw_uml9wTEvpFuYzg7ejlxgjge7CPxuJ4RnFxPW5zEbZQqJzFhkbjAfCPTgJ9iGVAfIuHswYCnRjOSl5-CKZNT8c0pCtQnYn5N19gizTmIsMxyykf2WA3D8dN1AU-cB8_LCW_9PNgBoT-VitzqwDlSuA4rKJwNQ3cJUG-Vs9VCDX7uGi0RDLM24fmDLxwBencHpb1z2bcgD82-GqGcsMcJNlB00pENXLooYEFtEQ1f1LKOOEYXcRfR2tL2oQK1FsCbH4uJxv08Q',

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
