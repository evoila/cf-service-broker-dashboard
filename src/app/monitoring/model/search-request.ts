export class SearchRequest {
    public range?: TimeRange;
    public appId?: string;
    public appName: string;
    public orgId: string;
    public space: string;
    public docSize?: DocSize;
    public query?: string;
    public filter: [Map<string, any>];
    public index: string;
}
export class TimeRange {
    public from?: number
    public to?: number
}
export interface DocSize {
    size: number
    from: number
}
