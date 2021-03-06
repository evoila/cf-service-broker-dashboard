import { PrometheusMetrics } from 'app/monitoring/model/prom-chart-request';

export class ChartRequestVm {
    index: string;
    doctype: string;
    appId: string;
    space: string;
    appName: string;
    range: any;
    interval: string;
    orgId: string;
    chartId: string;
    isEs: boolean;
    metrics: Array<PrometheusMetrics>;
    name: string;
    order: number;
    size: number;
    end: number;
    start: number;
    step: string;

}


