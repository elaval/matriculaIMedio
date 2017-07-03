import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import * as d3 from 'd3';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatriculaRecord } from 'app/models/matricula';

const API_BASE_URL = 'http://api.firstmakers.com/edudata/';

const SCOPE_ATTRIBUTES = {
  'department' : true,
  'category' : true,
  'division': true,
  'manufacturer': true,
  'brand': true,
  'upc_id': true
};

export interface WeekInfo {
  week_id: string;
  period_id: string;
  quarter_id: string;
  year_id: string;
  fiscalstartdate: string;
  fiscalenddate: string;
  fiscalsegperiodid: string;
  fiscaltruperiodid: string;
  promostartdate: string;
  promoenddate: string;
  promosegperiodid: string;
  batchload_id: string;
  last_update_ts: string;
  source_file: string;
}



export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // array in local storage for registered users
    const users: any[] = JSON.parse(localStorage.getItem('users')) || [];
    const httpCallSimulator = new HttpCallSimulator();

    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
        // wrap in timeout to simulate server api call
        setTimeout(() => {

            const params = getUrlParams(decodeURIComponent(connection.request.url));

            console.log(connection.request.url);

            // aggregatedMetrics?from=201601&to=201652

            // CHECK aggregatedMetrics entrypointy
            if (connection.request.url.startsWith(`${API_BASE_URL}test`) && connection.request.method === RequestMethod.Get
                && !params['by']) {
                httpCallSimulator.http_test(connection);
             return;
            }

            // pass through any requests not handled above
            const realHttp = new Http(realBackend, options);
            const requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe((response: Response) => {
                    connection.mockRespond(response);
                },
                (error: any) => {
                    connection.mockError(error);
                });

        }, 500);

    });

    return new Http(backend, options);
};

/**
 * Retrieves url get (search) params as a key/value object
 * source: https://www.sitepoint.com/get-url-parameters-with-javascript/
 *
 * @param {any} url
 */
function getUrlParams(url) {

  // get query string from url (optional) or window
  let queryString = url ? url.split('?')[1] : '';

  // we'll store the parameters here
  const obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    const arr = queryString.split('&');

    for (let i = 0; i < arr.length; i++) {
      // separate the keys and the values
      const a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      let paramNum = undefined;
      const paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1, -1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      const paramValue = typeof(a[1]) === 'undefined' ? true : a[1];


      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);

        // if array index number specified...
        } else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }

      // if param name doesn't exist yet, set it
      } else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}


class HttpCallSimulator {
    private byGradoData = null;  // Simulates Data From DB;

    constructor() {

    }

    loadCSVData() {
        const csvDataSubject = new Subject();

        // Data has already been loaded
        if (this.byGradoData) {
            csvDataSubject.next(this.byGradoData);

        // LOading data for the first time
        } else {
            d3.csv('assets/data/bygrado.txt')
            .row(d => { return {
                COD_ENSE3: d.COD_ENSE3,
                COD_GRADO2: d.COD_GRADO2,
                NUM_ESTUDIANTES: +d.NUM_ESTUDIANTES,
                AGNO: d.AGNO,
                COD_DEPE2: d.COD_DEPE2
            }; })
            .get((d: MatriculaRecord) => {
                this.byGradoData = d;
                csvDataSubject.next(this.byGradoData);
            });
        }


        return csvDataSubject.asObservable();
    }

    http_test(connection: MockConnection) {

        this.loadCSVData().subscribe( data => {
            connection.mockRespond(new Response(new ResponseOptions({
                'status': 200,
                'body': data
            })));
        });

    }



}


export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
