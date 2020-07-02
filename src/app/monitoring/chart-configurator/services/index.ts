import { ExampleChartsService } from './example-charts.service';
import { OptionsService } from './options.service';
import { AggregationService } from './aggregation.service';
import { AuthParameterService } from '../../shared/services/auth-param.service';

export const services = [
  ExampleChartsService,
  OptionsService,
  AggregationService,
  AuthParameterService
];
export * from './';
