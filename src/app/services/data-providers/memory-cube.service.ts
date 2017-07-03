import { Injectable } from '@angular/core';
import { CrossfilterService } from '../crossfilter.service';
import * as JSZip from 'jszip';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { DataModel, dimensionNames, metricNames, dimensionAliases } from '../../models/data-model';

interface Options {
  url: string;
}

@Injectable()
export class MemoryCubeService {
  cf: CrossFilter.CrossFilter<any>;

  private progressSubject: Subject<{stage: string, progress: number}> = new Subject();
  progress: Observable<{stage: string, progress: number}> = this.progressSubject.asObservable();

  rawData: DataModel[] = [];
  ready = false;

  private isDataZipped = false;

  constructor(
    private crossfilterService: CrossfilterService,
  ) { }

  setup(options: Options): Observable<{stage: string, progress: number}> {
    const url = options.url;

    const progressObservable = this.loadData(url);

    return progressObservable;
  }

  /**
   * Promise a binary file retreived from the give url
   */
  private getBinaryFile(url, progressCallback) {
    function resolver(resolve, reject) {

      // Read data from a compressed (zip) file
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';

      const reader = new FileReader();

      xhr.onload = function(e) {
        const blob = xhr.response;
        reader.readAsBinaryString(blob);
      };

      xhr.onprogress = function(e) {
        progressCallback(e.loaded / e.total);
      };

      reader.onload = (e) => {
        const data = reader.result;
        resolve(data);
      };

      reader.onerror = reject;
      xhr.onerror = reject;

      xhr.send();
    }

    return new Promise(resolver);
  }

  private zippedSource(zipped?: boolean) {
    this.isDataZipped = zipped;
    return this;
  }

  /**
   * Loads data from a plain tsv file
   */
  private loadDataFromPlainFile(data_url: string) {

    const resolver = (resolve, reject) => {
      d3.tsv(data_url)
      .get((data: DataModel[]) => {
        resolve(data);
      });
    };

    return new Promise(resolver);

  }

  /**
   * Loads data from a zipped tsv file
   */
  private loadDataFromZippedFile(data_url: string) {

    const resolver = (resolve, reject) => {
      const jszip = new JSZip();

      this.getBinaryFile(data_url, (progress) => this.progressSubject.next({stage: 'loading file', progress: progress / 2}))
      .then((data) => {
        this.progressSubject.next({stage: 'uncompressing', progress: 0.7});
        return jszip.loadAsync(data);
      })
      .then((tsv: any) => {
        this.progressSubject.next({stage: 'uncompressing', progress: 0.8});
        // We access the specific file within the zip package
        return tsv.file('data.txt').async('string', (metadata) => {
          if (metadata.percent > 50) {
            this.progressSubject.next({stage: 'uncompressing', progress: 0.8 + metadata.percent / 1000});
          }
        });
      })
      .then((datatsv) => {
        const dataJSON =  d3.tsvParse(datatsv);
        resolve(dataJSON);
      });
    };

    return new Promise(resolver);

  }

  /**
   * Retrieves a data file whoch is expected to be zipped,
   * then -> we unzip the file
   * then -> we process it assuming that is in tsv format
   * then -> we add data to a crossfilter service
   * then -> we create the models (Unit of Analysis)
   */
  private loadData(data_url: string) {
    this.loadDataFromPlainFile(data_url)
    .then((data) => {
      this.progressSubject.next({stage: 'parsing', progress: 0.95});

      _.each(data, (d: DataModel) => {

        // Convert values if there is an alias defined for it
        _.each(d, (value, dimension) => {
          if (dimensionAliases[dimension]) {
            d[dimension] = dimensionAliases[dimension][value] ? dimensionAliases[dimension][value] : value;
          }

        });

        // Transform dimensions into uppercase
        _.each(dimensionNames, (dimension) => {
          if (d[dimension]) {
            d[dimension] = d[dimension].toUpperCase();
          }
        });

        // Transform metrics into numbers and push new records
        _.each(metricNames, (metric) => {
          d[metric] = +d[metric];
        });
        this.rawData.push(d);
      });

      return new Promise((resolve, reject) => setTimeout(() => resolve(), 0));
    })
    .then(() => {
      this.progressSubject.next({stage: 'creating models', progress: 0.98});

      // We use timeout to allow for UI to display progress
      this.crossfilterService.setUp(this.rawData);
      // this.createModels();

      this.ready = true;
      this.progressSubject.next({stage: 'done', progress: 1});
    })
    .catch((e) => console.log(e));

    return this.progress;
  }


  getData(focus: any): Promise<any> {
    this.crossfilterService.setFilter(focus);

    const record = {
      metrics: this.crossfilterService.groups['all'].value(),
      focus: _.clone(focus)
    };

    return Promise.resolve(record);
  }

  getChildren(focus: any, byDimension: string) {
      const data = this.crossfilterService.getDimensions(focus, byDimension);
      const children = [];

      _.each(data, (item) => {
        const record: any = {};
        record.focus = _.clone(focus);
        record.focus[byDimension] = item.key;
        record.metrics = item.value;
        record.children = {};

        children.push(record);
      });

      return Promise.resolve(children);
  }

}
