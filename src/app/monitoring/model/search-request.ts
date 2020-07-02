import { AuthScope } from "../chart-configurator/model/authScope";

export class SearchRequest {
    public range?: TimeRange;
    public appId?: string;
    public appName: string;
    public authScope: AuthScope;
    public docSize?: DocSize;
    public query?: string;
    public filter: [Map<string, any>]
}
export class TimeRange {
    public from?: number
    public to?: number
}
export interface DocSize {
    size: number
    from: number
}
