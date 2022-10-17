import { ChartType } from "angular-google-charts";

export class ChartDefinition {
    columns!: any[];
    datasource!: any[];
    type!: ChartType;
    width!: number;
    height!: number;
    options!: any;
}