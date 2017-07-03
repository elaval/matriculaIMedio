import * as _ from 'lodash';
import { DataService } from '../services/data.service';
import { dimensionNames, Focus, orderValue , getMainMetric, getMetricLY} from './data-model';
import { TY } from '../config';

export class UnitOfAnalysis {
    parent: UnitOfAnalysis;
    root: UnitOfAnalysis= null;

    metrics;
    dataService;
    focus: Focus;
    dimensions;

    history;

    relatedUnits = {};

    children: {} = {};

    constructor(options: {focus?: {}, dataService: DataService, metrics: {}, dontRecurse?: boolean}) {
      this.focus = options.focus ? options.focus : {};
      this.metrics = options.metrics;
      this.dataService = options.dataService;
    }

    /**
     * Gets this units growth (compare to LY)
     */
    growthTY() {
      return this.enrollmentTY() - this.enrollmentLY();
    }

    enrollmentTY() {
      return +this.metrics.educacion.matricula.total;
    }

    enrollmentLY() {
      return +this.metrics.educacion.matricula.totalLY;
    }

    enrollmentVariationPercent() {
      const valueTY = this.enrollmentTY();
      const valueLY = this.enrollmentLY();

      const variationPercent = valueTY && valueLY ? ((valueTY / valueLY) - 1) : null;

      return variationPercent;
    }

    enrollmentHistory() {
      let data = [];

      _.each(this.metrics, (value, key) => {
        const regexp = /^matricula(\d\d\d\d)$/;
        const regexpRes = regexp.exec(key);
        if (regexpRes && regexpRes[1]) {
          data.push({
            'year' : regexpRes[1],
            'value' : value
          });
        }
        data = _.sortBy(data, d => d.year);
      });

      return data;
    }

    /**
     * Promise to this unit's children by a certain dimension
     */
    getChildren(byDimension) {

      const resolver = (resolve, reject) => {
        const children = this.children[byDimension];

        if (children) {
          resolve (children);
        } else {
          this.dataService.buildChildren(this.focus, byDimension)
          .then(d => {
            this.children[byDimension] = d;
            resolve(d);
          });
        }
      };

      return new Promise(resolver);
    }

    getHistory() {

      const resolver = (resolve, reject) => {

        if (this.history) {
          resolve (this.history);
        } else {
          this.dataService.getHistory(this.focus)
          .then(d => {
            this.history = d;
            resolve(d);
          });
        }
      };

      return new Promise(resolver);
    }

}
