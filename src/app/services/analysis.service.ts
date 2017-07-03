import { Injectable } from '@angular/core';
import { UnitOfAnalysis } from 'app/models/unit-of-analysis';
import * as _ from 'lodash';

@Injectable()
export class AnalysisService {

  constructor() { }

  analyiseBy(unit: UnitOfAnalysis, dimension: string) {
    return new Promise((resolve, reject) => {

      unit.getChildren(dimension)
      .then((units: UnitOfAnalysis[]) => {
        resolve(units);
      });

    });
  }

  analyseGrowth(units) {
    const growthArray = [];

    _.each(units, (unit: UnitOfAnalysis) => {
      const record: any = {};

      record.unit = unit;
      record.growth = unit.growthTY();
      record.valueTY = unit.enrollmentTY();

      growthArray.push(record);
    });

    const sortedArray = _.sortBy(growthArray, (d) => d.growth);

  }

}






