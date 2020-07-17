
export class PanelElement {
    readonly id?: string;
    order: number;
    size: number;
    type: string;
    table: any;
    constructor(order: number = 0, size: number = 0, type: string) {
        this.order = order;
        this.size = size; this.type = type
    }
}

