import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ComunaDeficit } from 'app/models/comunaDeficit';

interface Options {
  url: string;
}

export interface ComunaDeficitRaw {
  COMUNA: string;
  FLOW_2015_MUN_AD: string;
  FLOW_2015_MUN_AD_SAME: string;
  FLOW_2015_MUN_MUN: string;
  FLOW_2015_MUN_MUN_SAME: string;
  FLOW_2015_MUN_PP: string;
  FLOW_2015_MUN_PP_SAME: string;
  FLOW_2015_MUN_PS: string;
  FLOW_2015_MUN_PS_SAME: string;

  FLOW_2015_PS_AD: string;
  FLOW_2015_PS_AD_SAME: string;
  FLOW_2015_PS_MUN: string;
  FLOW_2015_PS_MUN_SAME: string;
  FLOW_2015_PS_PP: string;
  FLOW_2015_PS_PP_SAME: string;
  FLOW_2015_PS_PS: string;
  FLOW_2015_PS_PS_SAME: string;

  FLOW_2016_MUN_AD: string;
  FLOW_2016_MUN_AD_SAME: string;
  FLOW_2016_MUN_MUN: string;
  FLOW_2016_MUN_MUN_SAME: string;
  FLOW_2016_MUN_PP: string;
  FLOW_2016_MUN_PP_SAME: string;
  FLOW_2016_MUN_PS: string;
  FLOW_2016_MUN_PS_SAME: string;

  FLOW_2016_PS_AD: string;
  FLOW_2016_PS_AD_SAME: string;
  FLOW_2016_PS_MUN: string;
  FLOW_2016_PS_MUN_SAME: string;
  FLOW_2016_PS_PP: string;
  FLOW_2016_PS_PP_SAME: string;
  FLOW_2016_PS_PS: string;
  FLOW_2016_PS_PS_SAME: string;

  FLOW_2016_PP_AD: string;
  FLOW_2016_PP_AD_SAME: string;
  FLOW_2016_PP_MUN: string;
  FLOW_2016_PP_MUN_SAME: string;
  FLOW_2016_PP_PP: string;
  FLOW_2016_PP_PP_SAME: string;
  FLOW_2016_PP_PS: string;
  FLOW_2016_PP_PS_SAME: string;

  FLOW_2016_AD_MUN: string;
  FLOW_2016_AD_PS: string;
  FLOW_2016_AD_PP: string;
  FLOW_2016_AD_AD: string;
  FLOW_2016_AD_MUN_SAME: string;
  FLOW_2016_AD_PS_SAME: string;
  FLOW_2016_AD_PP_SAME: string;
  FLOW_2016_AD_AD_SAME: string;

  MATRICULA_2015_AD: string;
  MATRICULA_2015_MUN: string;
  MATRICULA_2015_PP: string;
  MATRICULA_2015_PS: string;
  MATRICULA_2016_AD: string;
  MATRICULA_2016_MUN: string;
  MATRICULA_2016_PP: string;
  MATRICULA_2016_PS: string;
}


@Injectable()
export class ApiProviderService {
  backendURL;

  comunaSubject: Subject<ComunaDeficit[]> = new Subject();
  comuna: Observable<ComunaDeficit[]> = this.comunaSubject.asObservable();


  constructor(
  ) { }

  setup(options: Options) {
    this.backendURL = options.url;
  }


  getData(focus: any) {
    let url = this.backendURL + 'matricula?';

    _.each(focus, (value, key) => {
      url += `${key}=${value}&`;
    });

    const resolver = (resolve, reject) => {
      d3.json(url)
      .get((uaData) => {
        const data = uaData && uaData[0];
        resolve(data);
      });
    };

    return new Promise(resolver);
  }

  getHistory(focus: any) {
    let url = this.backendURL + 'pais?';

    if (!focus.region && !focus.comuna) {
       url = this.backendURL + 'pais?';

    } else if (focus.region && !focus.comuna) {
       url = this.backendURL + `region/${focus.region}?`;

    } else if (focus.region && !focus.comuna) {
       url = this.backendURL + `comuna/${focus.comuna}?`;
    }

    url = url + 'año=all';


    const resolver = (resolve, reject) => {

      d3.json(url)
      .get((uaData) => {
        resolve(uaData ? uaData : null);
      });
    };

    return new Promise(resolver);

  }

  getChildren(focus: any, dimension: string) {
    let url = this.backendURL + 'matricula?';

    _.each(focus, (value, key) => {
      url += `${key}=${value}&`;
    });

    url += `by=${dimension}&`;

    const resolver = (resolve, reject) => {

      d3.json(url)
      .get((uaData: any[]) => {
        const data = uaData;

        resolve(data ? data : null);
      });
    };

    return new Promise(resolver);
  }

  getChildrenTYLY(
     focus: any,
     dimension: string
    ) {
    const resolver = (resolve, reject) => {
      let dataTY: any = null;
      let añoTY = null;
      let añoLY = null;

      if (dimension === 'año') {

        this.getChildren(focus, dimension)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err));

      } else {
        this.getChildren(focus, dimension)
        .then((data) => {
          dataTY = data;

          if (data && data [0]) {
            añoTY = data[0].año;
          }

          añoLY = +añoTY - 1;

          const focusLY = _.clone(focus);
          focusLY['año'] = añoLY;
          return this.getChildren(focusLY, dimension);
        })
        .then((data) => {
          const dataLY = data;
          const mergedData = this.mergeChildrenDataTYLY(dimension, añoTY, añoLY, dataTY, dataLY );

          resolve(mergedData);
        })
        .catch((err) => reject(err));
      }


    };

    return new Promise(resolver);
  }



  mergeChildrenDataTYLY(byDimension, TYyear, LYyear, TYData: any, LYData: any) {
    const children = [];

    const bothYearData = TYData.concat(LYData);

    const groupedByDimension = _.groupBy(bothYearData, (d) => d[byDimension]);

    _.each(groupedByDimension, (values, dimension) => {
      const recordTY = _.find(values, (d: any) => d['año'] === TYyear);
      const recordLY = _.find(values, (d: any) => d['año'] === LYyear);

      recordTY.metrics.educacion.matricula.totalLY = recordLY.metrics.educacion.matricula.total;
    });

    return TYData;
  }

  getDataMatricula2015_2016() {
    d3.csv('assets/data/comunas_2015_2016.txt',
    (data: ComunaDeficitRaw[]) => {
      const output = data.map((d) => new ComunaDeficit(d));
      this.comunaSubject.next(output);
    });

    return this.comuna;
  }

}
