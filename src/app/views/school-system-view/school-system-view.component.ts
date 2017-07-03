import { Component, OnInit, NgZone } from '@angular/core';
import * as _ from 'lodash';

import { DataService } from '../../services/data.service';
import { UnitOfAnalysis } from '../../models/unit-of-analysis';
import { AnalysisService } from 'app/services/analysis.service';

const defaultOrder = {
  dependencia: ['municipal', 'subvencionada', 'privada', 'administracionDelegada'],
  region: [],
  comuna: null
};

@Component({
  selector: 'app-school-system-view',
  templateUrl: './school-system-view.component.html',
  styleUrls: ['./school-system-view.component.css']
})
export class SchoolSystemViewComponent implements OnInit {
  enrollmentTY;
  enrollmentLY;
  enrollmentHistory;
  enrollmentVariation;
  chartData;
  chartSeries;
  chartByDependenciaSeries;
  chartAllDependenciaSeries;

  chartDepSeries;
  chartDepCategories;

  chartRegionesSeries;
  chartRegionesCategories;

  chartComunasSeries;
  chartComunasCategories;

  question; // NAtural language question being asked
  unitOfAnalysis;
  focusElements;
  splitBy;

  visibleCharts = {
    dependencia: true,
    region: true,
    comuna: false,
    ruralidad : true
  };

  dataComunas;  // Array with oabjecta that contain name & value for each comuna in the current UA
  unitsByTipoEducacion; // Array with metrics for each tipo de Educacion (parvularia, basica, ...)
  unitsByAño;
  

  constructor(
    
    private dataService: DataService,
    //private zone: NgZone,
    //private analysisService: AnalysisService
    
  ) { }

  ngOnInit() {
    this.startupSteps();
  }

  startupSteps() {



  }



}
