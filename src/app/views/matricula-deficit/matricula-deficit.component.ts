import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DataService } from 'app/services/data.service';
import { ComunaDeficit } from 'app/models/comunaDeficit';

@Component({
  selector: 'app-matricula-deficit',
  templateUrl: './matricula-deficit.component.html',
  styleUrls: ['./matricula-deficit.component.css']
})
export class MatriculaDeficitComponent implements OnInit {
  selected_comunasInmutables: ComunaDeficit;
  muestra_comunasInmutables: ComunaDeficit[];
  comunasInmutables: ComunaDeficit[];
  selected_comunasConvertidoras: ComunaDeficit;
  muestra_comunasConvertidoras: ComunaDeficit[];
  comunasConvertidoras: ComunaDeficit[];
  selected_comunasEducacionMunicipalAtractiva: ComunaDeficit;
  muestra_comunasEducacionMunicipalAtractiva: ComunaDeficit[];
  comunasEducacionMunicipalAtractiva: ComunaDeficit[];
  selected_comunasImportadoras: ComunaDeficit;
  muestra_comunasImportadoras: ComunaDeficit[];
  selected_comunasSinEducacionMedia: ComunaDeficit;
  muestra_comunasSinEducacionMedia: ComunaDeficit[];
  comunasSinEducacionMedia: ComunaDeficit[];
  muestra_comunasSinLiceosMunicipales: ComunaDeficit[];
  selected_comunasSinLiceosMunicipales: ComunaDeficit;
  comunasSinLiceosMunicipales: ComunaDeficit[];

  selected_comunasSoloLiceosMunicipales: ComunaDeficit;
  muestra_comunasSoloLiceosMunicipales: ComunaDeficit[];
  comunasSoloLiceosMunicipales: ComunaDeficit[];

  selectedAtractiva: any;
  selectedPocoAtractiva: any;
  muestraPocoAtractivas: any;
  muestraAtractivas: any;
  muestraPocoAtractivas_: any;
  muestraAtractivas_: any;
  deficit: number;
  matriculaNacionalIro: number;
  matriculaNacional8vo: number;
  conLiceosAtractivos: ComunaDeficit[];
  conLiceosPocoAtractivos: ComunaDeficit[];
  totalExportadora: number;
  total: number;
  diametroExportadora: number;
  diametroBase: number;
  mixta: ComunaDeficit[];
  comunasConversasMunicipal: ComunaDeficit[];
  comunasConversas: ComunaDeficit[];
  selectedComunas: ComunaDeficit[];
  selectedComuna: ComunaDeficit;
  ratioSurplusDeficitArea: number;
  totalSurplus: number;
  totalDeficit: number;
  comunasImportadoras: ComunaDeficit[];
  comunasExportadoras: ComunaDeficit[];
  comunasSinDeficit: ComunaDeficit[];
  comunasConDeficit: ComunaDeficit[];
  comunas: ComunaDeficit[];
  
  higlightText;

  constructor(
    private dataService: DataService,
    // private angulartics2: Angulartics2

  ) { }

  ngOnInit() {
    this.dataService.getDataMatricula2015_2016()
    .subscribe((data: ComunaDeficit[]) => {
      this.comunas = data;

      this.comunasConDeficit = data.filter((d) => d.hasDeficit());
      this.comunasConDeficit = _.sortBy(this.comunasConDeficit, (d) => -d.deficit / d.matricula8vo);

      this.comunasSinDeficit = data.filter((d) => !d.hasDeficit());
      this.comunasSinDeficit = _.sortBy(this.comunasSinDeficit, (d) => d.deficit);

      this.comunasExportadoras = data.filter((d) => d.isExporter() && d.hasDeficit());
      this.comunasImportadoras = data.filter((d) => d.isImporter() && !d.hasDeficit());

      this.comunasConversas = data.filter((d) => d.isConversaParticular() && d.hasDeficit());
      this.comunasConversasMunicipal = data.filter((d) => d.isConversaMunicipal() && !d.hasDeficit());

      this.mixta = data.filter((d) => !d.isImporter() && !d.isConversaMunicipal() && !d.hasDeficit());

      this.totalDeficit = this.comunasConDeficit.reduce((memo, d) => d.deficit + memo, 0);
      this.totalSurplus = this.comunasSinDeficit.reduce((memo, d) => -d.deficit + memo, 0);
      this.totalExportadora = this.comunasExportadoras.reduce((memo, d) => d.deficit + memo, 0);
      this.total = this.totalDeficit + this.totalSurplus;


      this.diametroBase = 300;
      this.diametroExportadora = this.diametroBase * Math.sqrt(this.totalExportadora / this.total); ;

      this.ratioSurplusDeficitArea = Math.sqrt(this.totalSurplus / this.totalDeficit);

      console.log(300 * this.ratioSurplusDeficitArea);

      // Selección de comunas
      // Importadoras
      this.comunasImportadoras = data.filter((d) => d.outfluxIntracomunal > 0 && !d.hasDeficit());
      this.muestra_comunasImportadoras = _.sampleSize(this.comunasImportadoras, 5);
      this.selected_comunasImportadoras = this.muestra_comunasImportadoras[0];

      // Convertidoras
      this.comunasConvertidoras = data.filter((d) => d.outfluxIntercomunal > 0 && !d.hasDeficit());
      this.muestra_comunasConvertidoras = _.sampleSize(this.comunasConvertidoras, 5);
      this.selected_comunasConvertidoras = this.muestra_comunasConvertidoras[0];

      // Atractivas
      this.comunasEducacionMunicipalAtractiva = data.filter((d) => d.outfluxIntercomunal < 0 && d.outfluxIntracomunal < 0 && !d.hasDeficit());
      this.muestra_comunasEducacionMunicipalAtractiva = _.sampleSize(this.comunasEducacionMunicipalAtractiva, 5);
      this.selected_comunasEducacionMunicipalAtractiva = this.muestra_comunasEducacionMunicipalAtractiva[0];

      // Inmutables
      this.comunasInmutables = data.filter((d) => d.outfluxIntercomunal === 0 && d.outfluxIntracomunal === 0);
      this.muestra_comunasInmutables = _.sampleSize(this.comunasInmutables, 5);
      this.selected_comunasInmutables = this.muestra_comunasInmutables[0];

      // Poco atractivas
      this.conLiceosPocoAtractivos = data.filter((d) => d.matriculaI > 0 && d.hasDeficit() && d.deficit > 0.5 * d.matricula8vo);
      this.muestraPocoAtractivas = _.sampleSize(this.conLiceosPocoAtractivos, 5);
      this.selectedPocoAtractiva = this.muestraPocoAtractivas[0];

      // Atractivas
      this.conLiceosAtractivos = data.filter((d) => !d.hasDeficit() && -d.deficit > 0.25 * d.matricula8vo);
      this.muestraAtractivas = _.sampleSize(this.conLiceosAtractivos, 5);
      this.selectedAtractiva = this.muestraAtractivas[0];


      // Sin liceos municipales
      this.comunasSinLiceosMunicipales = data.filter((d) =>  d.matriculaI === 0 && d.matriculaINoMunicipal > 0);
      this.muestra_comunasSinLiceosMunicipales = _.sampleSize(this.comunasSinLiceosMunicipales, 5);
      this.selected_comunasSinLiceosMunicipales = this.muestra_comunasSinLiceosMunicipales[0];

      // Solo liceos municipales
      this.comunasSoloLiceosMunicipales = data.filter((d) =>  d.matriculaINoMunicipal === 0 && d.matriculaI > 0);
      this.muestra_comunasSoloLiceosMunicipales = _.sampleSize(this.comunasSoloLiceosMunicipales, 5);
      this.selected_comunasSoloLiceosMunicipales = this.muestra_comunasSoloLiceosMunicipales[0];
      
      // Sin educación media
      this.comunasSinEducacionMedia = data.filter((d) =>  d.matriculaINoMunicipal === 0 && d.matriculaI === 0);
      this.muestra_comunasSinEducacionMedia = _.sampleSize(this.comunasSinEducacionMedia, 5);
      this.selected_comunasSinEducacionMedia = this.muestra_comunasSinEducacionMedia[0];


      this.matriculaNacional8vo = data.reduce((memo, d) => d.matricula8vo + memo, 0);
      this.matriculaNacionalIro = data.reduce((memo, d) => d.matriculaI + memo, 0);
      this.deficit = data.reduce((memo, d) => d.deficit + memo, 0);

    });
  }

  deficitAccesor(d) {
    return d.deficit;
  }

  selectComuna(d: ComunaDeficit) {
    this.selectedComunas = [d];
  }

  surplusAccesor(d) {
    return -d.deficit;
  }

  changeHiglightSelection(text) {
    if (text.length > 2) {
      this.selectedComunas = this.comunas.filter((d) => {
        const searchRegExp = new RegExp(`.*${text}.*`, 'i');

        //this.angulartics2.eventTrack.next({ action: 'search', properties: { category: 'comuna', label: text }});       

        return searchRegExp.test(d.comuna);
      });
    } else {
      this.selectedComunas = [];
    }

  }
}


