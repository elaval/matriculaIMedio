import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import * as _ from 'lodash';

import { DataModel, dimensionNames, metricNames, dimensionAliases } from '../models/data-model';
import { UnitOfAnalysis } from '../models/unit-of-analysis';

import { MemoryCubeService } from './data-providers/memory-cube.service';
import { ApiProviderService } from './data-providers/api-provider.service';
import { CrossfilterService } from './crossfilter.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { UnitDictionary } from '../models/unit-dictionary';

import { filePaths, url } from '../config';
import { Http } from '@angular/http';


@Injectable()
export class DataService {
  cf: CrossFilter.CrossFilter<any>;
  ready = false;

  rootUA: UnitOfAnalysis;

  private unitLoadingSubject: Subject<boolean> = new Subject();
  unitLoading: Observable<boolean> = this.unitLoadingSubject.asObservable();

  private progressSubject: BehaviorSubject<{stage: string, progress: number}> = new BehaviorSubject({stage: null, progress: null});
  progress: Observable<{stage: string, progress: number}> = this.progressSubject.asObservable();

  private unitOfAnalysisSubject: BehaviorSubject<UnitOfAnalysis> = new BehaviorSubject(null);
  unitOfAnalysis: Observable<UnitOfAnalysis> = this.unitOfAnalysisSubject.asObservable();

  private dataMatriculaSubject: Subject<any> = new Subject();
  dataMatricula: Observable<any> = this.dataMatriculaSubject.asObservable();


  rawData: DataModel[] = [];
  rootUnitOfAnalysis: UnitOfAnalysis;
  currentUnitOfAnalysis: UnitOfAnalysis;
  appliedFilters = {};

  dataSource =  'api';

  backendUrl= url.dataAPI;
  localdataUrl= filePaths.dataFile;

  // Utility for storing and retreiving units associated to a multikey index (the unit focus - e.g. {brand:'NESTLE', division:'SOUTH'})
  unitStorage = new UnitDictionary();

  // we will use one data provider that coudl be a memoryCubeService or an APIService
  dataProvider: any;

  constructor(
    private apiProviderService: ApiProviderService,
    private http: Http
  ) {

    // We are going to get data from a compressed file (.zip) that has tsv values
    const captured = /quickload=([^&]+)/.exec(location.search)
      ? /quickload=([^&]+)/.exec(location.search)[1] : null; // Value is in [1] ('384' in our case)

    const quickload = captured ? captured : false;

    const capturedDataSource = /dataSource=([^&]+)/.exec(location.search)
      ? /dataSource=([^&]+)/.exec(location.search)[1] : null; // Value is in [1] ('384' in our case)

    this.dataSource = capturedDataSource ? capturedDataSource : 'api';


    const data_url = this.localdataUrl;

    if (this.dataSource === 'localFile') {
 
    } else {
      this.apiProviderService.setup({url: this.backendUrl});
      this.dataProvider = this.apiProviderService;
      this.loadRootUA();
      this.progressSubject.next({stage: 'done', progress: 1});
    }

  }

  loadRootUA() {
    const rootFocus = {};
    /** 
    this.getUnitofAnalysis(rootFocus)
    .then(unit => {
      this.rootUnitOfAnalysis = unit;
      this.currentUnitOfAnalysis = this.rootUnitOfAnalysis;
      this.unitOfAnalysisSubject.next(this.currentUnitOfAnalysis);
    });
    */
  }


  setFilter(focus) {
    this.getUnitofAnalysis(focus)
    .then(unit => {
      this.currentUnitOfAnalysis = unit;
      this.unitOfAnalysisSubject.next(this.currentUnitOfAnalysis);
    });
  }


  /**
   * Selects the given unit as the current Unit of Analyis, updates filters and propagates the unit through unitOfAnalysis observable
   */
  selectUnitOfAnalysis(unit) {
    this.appliedFilters = _.clone(unit.focus);
    this.currentUnitOfAnalysis = unit;
    this.unitOfAnalysisSubject.next(this.currentUnitOfAnalysis);
  }


  getChildren(focus: any, dimension: string) {
    return this.dataProvider.getChildren(focus, dimension);
  }



  getHistory(focus: any, dimension: string) {
    return this.dataProvider.getHistory(focus);
  }


  /**
   * Promise to a unit of analysys give its focus
   */
  getUnitofAnalysis(focus): Promise<UnitOfAnalysis> {

    const resolver = (resolve, reject) => {
      // First try to retreive the unit from in memory unitStorage (we store here previously created units)
      let unit = this.unitStorage.get(focus);

      if (unit) {
        return resolve(unit);
      } else {
        let dataTY;
        // If not in storage, we create the new unit with data obtained from data providers
        this.dataProvider.getData(focus)
        .then(data => {
          dataTY = data;

          const añoTY = +dataTY['año'];
          const añoLY = +añoTY - 1;
          const focusLY = _.clone(focus);
          focusLY.año = añoLY;
          return this.dataProvider.getData(focusLY);
        })
        .then((dataLY) => {

          dataTY.metrics.educacion.matricula.totalLY = dataLY.metrics.educacion.matricula.total;

          unit = new UnitOfAnalysis({dataService: this, focus: focus, metrics: dataTY.metrics});
          this.unitStorage.set(focus, unit);
          resolve(unit);
        })
        .catch(err => reject(err));
      };
    };
    return new Promise<UnitOfAnalysis>(resolver);
  }

  /**
   * Promise an array of unit of Analysis which are the units children by a specific dimension
   */
  buildChildren(focus, byDimension) {
    const resolver = (resolve, reject) => {
      this.dataProvider.getChildrenTYLY(focus, byDimension)
      .then(items => {
        const children = [];

        _.each(items, (item) => {
          const childFocus = _.clone(focus);
          childFocus[byDimension] = item[byDimension];
          const unit = new UnitOfAnalysis({dataService: this, focus: childFocus, metrics: item.metrics});
          this.unitStorage.set(childFocus, unit);
          children.push(unit);
        });
        resolve(children);
      })
      .catch(err => console.log(err));
    };

    return new Promise(resolver);
  }

  getDataMatricula() {
    this.http.get('http://api.firstmakers.com/edudata/test')
    .map((d) => d.json())
    .subscribe((d) => this.dataMatriculaSubject.next(d));
  }

  getDataMatricula2015_2016() {
    return this.dataProvider.getDataMatricula2015_2016();
  }

}
