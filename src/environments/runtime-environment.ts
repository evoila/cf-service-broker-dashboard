import { ExtensionUrl, Server } from "../app/core/extension-url";

// this var may be injected via index.html and server-side include
const injectedEnv = window["INJECTED_ENVIRONMENT"];
let seedEnv: Environment;

if (!injectedEnv) {
  // tslint:disable-next-line:no-console
  console.warn(
    "DASHBOARD DEFAULT DEVELOPMENT ENV ACTIVE - DID YOU FORGET TO INJECT A RUNTIME ENV?"
  );
  seedEnv = {
    serviceInstanceId: "73047820-8d36-4323-bf2b-77dc887a707e",
    token:
      "bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vdWFhLnN5c3RlbS5jZi5ob2IubG9jYWwvdG9rZW5fa2V5cyIsImtpZCI6ImtleS0xIiwidHlwIjoiSldUIn0.eyJqdGkiOiJlZmU3NWZkZDc1YTA0OTA4YjJjMTUzNThlODU1OTVjZCIsInN1YiI6Ijg3ODM4ZDQ1LWU2NTMtNDE4Ny1iODAxLTBmMTE4MDRhYzAwOSIsInNjb3BlIjpbImNsb3VkX2NvbnRyb2xsZXIucmVhZCIsInBhc3N3b3JkLndyaXRlIiwiY2xvdWRfY29udHJvbGxlci53cml0ZSIsIm9wZW5pZCIsInNjaW0ud3JpdGUiLCJzY2ltLnJlYWQiLCJjbG91ZF9jb250cm9sbGVyLmFkbWluIiwidWFhLnVzZXIiXSwiY2xpZW50X2lkIjoiY2YiLCJjaWQiOiJjZiIsImF6cCI6ImNmIiwiZ3JhbnRfdHlwZSI6InBhc3N3b3JkIiwidXNlcl9pZCI6Ijg3ODM4ZDQ1LWU2NTMtNDE4Ny1iODAxLTBmMTE4MDRhYzAwOSIsIm9yaWdpbiI6IkV2b2lsYVNTTyIsInVzZXJfbmFtZSI6ImpoZXlsIiwiZW1haWwiOiJqaGV5bEBldm9pbGEuZGUiLCJyZXZfc2lnIjoiNWQ0MmI5ZDkiLCJpYXQiOjE1OTM2MDE3NDMsImV4cCI6MTU5MzYwMjM0MywiaXNzIjoiaHR0cHM6Ly91YWEuc3lzdGVtLmNmLmhvYi5sb2NhbC9vYXV0aC90b2tlbiIsInppZCI6InVhYSIsImF1ZCI6WyJzY2ltIiwiY2xvdWRfY29udHJvbGxlciIsInBhc3N3b3JkIiwiY2YiLCJ1YWEiLCJvcGVuaWQiXX0.tWfeq_f8ymubbIuONfQMFv_VVHfFzjoQJ9GO3zKVrqgk8FkyzTG8l3XMy-tvKt18lyfOF55DICqX7wN_3mwJoThFF6i2b6SyGMKADJBlyLYgHlaUh7OYatR_kOzAjRoj_oBwuM0oyuyIfCMYlLPzHxdYOlZXz4L7DkbeO2xmE0itSJG6fWjRlQZNN74Smjz86tU2vviN0quKW2HaMhjdidEsUH0jtm5ZHDGjy9qwH2n1Evma3ynJn7yjIC2MkN235q5vBzHG8WHJBv70GbSPfmBwEror_ywUUyXyk2CDfj9ilhSYjc16m0Pp7QWgC2ZxIAyr8vLixccs5GvXjQfOUA",

    baseUrls: {
      serviceBrokerUrl: "https://osb-log-metric-test.system.cf.hob.local"
    },
    production: false,
    customEndpoints: [
      {
        url:
          "https://osb-log-metric-dashboard-backend-test.system.cf.hob.local",
        identifier: "log-metric-backend"
      },
      //{ url: 'https://log-metric-backend-feature.system.cf.hob.local', identifier: 'log-metric-backend' },
      //{ url: 'http://localhost:8080', identifier: 'log-metric-backend' },
      { url: "http://localhost:8081", identifier: "osb-backup-manager" }
    ],
    ui: {
      title: "Service Broker Panel",

      logoSrc: "./assets/core/sb-white.svg"
    }
  } as Environment;
} else {
  seedEnv = {
    serviceInstanceId: "/*[[${serviceInstanceId}]]*/",
    token: "/*[[${token}]]*/",
    baseUrls: {
      serviceBrokerUrl: "/*[[${endpointUrl}]]*/"
    },
    production: true,
    ui: {
      title: "Service Broker Panel",
      logoSrc: "./assets/core/sb-white.svg"
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
