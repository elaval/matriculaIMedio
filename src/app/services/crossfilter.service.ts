import { Injectable } from '@angular/core';
import * as crossfilter from 'crossfilter';
import * as _ from 'lodash';

import { dimensionNames, addReduceFunctions } from '../models/data-model'

@Injectable()
export class CrossfilterService {
  cf;

  currentCrossfilterFilters={};

  dimensions:{} = {};
  groups:{} = {};

  constructor() { }

  setUp(data) {
    this.cf =  crossfilter(data);

    let sampleRecord = data[0];


    // Check is data contains the dimensions defined in the data model
    if (!(data)) {
      console.error('No records in data');
    }



    // Create dimensions and groups for each dimension defined in the Data Model
    _.each(dimensionNames, (dim) => {
        if (sampleRecord[dim]) {
          this.dimensions[dim] = this.cf.dimension(function(d) { return d[dim]});
          this.groups[dim] =this.dimensions[dim].group();
        } else {
          console.error('Dimension '+dim+' defined in Data Model but not present in the data');
        }
    })

    _.each(_.keys(this.dimensions), key => {
      this.groups[key] = this.dimensions[key].group();
      this.groups[key].reduce(
        addReduceFunctions.add,
        addReduceFunctions.remove,
        addReduceFunctions.initial
      )
      this.groups[key].order( d => -d.growth );
    })

    this.groups['all'] = this.cf.groupAll();
    this.groups['all'].reduce(
        addReduceFunctions.add,
        addReduceFunctions.remove,
        addReduceFunctions.initial
      )
  }

  addFilter(dimension, value) {

    if (this.currentCrossfilterFilters[dimension] && this.currentCrossfilterFilters[dimension] !== value) {
      this.dimensions[dimension].filterAll();
    }

    this.dimensions[dimension].filter(value);
    this.currentCrossfilterFilters[dimension]=value;
  }

  removeFilter(dimension) {

    if (this.dimensions[dimension]) this.dimensions[dimension].filterAll();
    this.currentCrossfilterFilters[dimension]=null;
  }

  setFilter(filterOptions) {
    _.each(this.currentCrossfilterFilters, (value, dimension) => {
      // If dimension is currently applied but not especified in filterOptions
      if (value && !filterOptions[dimension]) {
        this.removeFilter(dimension);
      }
    })

    _.each(filterOptions, (value, dimension) => {
      this.addFilter(dimension, value)
    })
  }

  resetFilters() {
    _.each(this.dimensions, (dim:any) => {
      dim.filterAll()
    })
  }

  getDimensions(focus:any, dimension:string) {

    let result;

    if (focus[dimension]) {
      result = null;
    } else {
      //this.resetFilters();

      // Remove filters that don not Apply
      _.each(this.currentCrossfilterFilters, (value,key) => {
        if (value && value !== focus[key]) {
          this.dimensions[key].filterAll();
          this.currentCrossfilterFilters[key]=null;
        }
      })

      // Apply the new filters
      _.each(focus, (value,key) => {
        if (this.currentCrossfilterFilters[key] && this.currentCrossfilterFilters[key]!==value) {
          this.dimensions[key].filterAll();
          this.dimensions[key].filter(value);
          this.currentCrossfilterFilters[key]=value;
        } else if (!this.currentCrossfilterFilters[key]) {
          this.dimensions[key].filter(value);
          this.currentCrossfilterFilters[key]=value;
        }
      })
      
      let group = this.groups[dimension] ? this.groups[dimension] : null;
      
      result = group 
        ? _.filter(group.order((d)=>d.growth_amount).top(Infinity), (d:any) => d.value.count >=1)
        : null;
    }

    return result
  }

}

