import * as _ from 'lodash';


export interface MatriculaRecord  {
  COD_ENSE3: string;
  COD_GRADO2: string;
  NUM_ESTUDIANTES: number;
  AGNO: string;
  COD_DEPE2: string;
}

export interface MatriculaData  {
  itemsYear: MatriculaYear[];
}

interface MatriculaByYear { [s: string]: MatriculaYear; }


export interface MatriculaYear {
  desc: string;
  id: string;
  numeroEstudiantes: number;
  itemsEnsenanza: MatriculaEnseñanza[];
}

export interface MatriculaEnseñanza {
  desc: string;
  id: string;
  numeroEstudiantes: number;
  itemsGrado: MatriculaGrado[]
}

export interface MatriculaGrado {
  desc: string;
  id: string;
  numeroEstudiantes: number;
  itemsDependencia: MatriculaDependencia[];
}

export interface MatriculaDependencia {
  desc: string;
  id: string;
  numeroEstudiantes: number;
}

const COD_ENS3_MAP = {
  1: 'Educación Parvularia',
  2: 'Enseñanza Básica Niños',
  3: 'Educación Básica Adultos',
  4: 'Enseñanza Media Humanístico Científica Jóvenes',
  5: 'Educación Media Humanístico Científica Adultos',
  6: 'Enseñanza Media Técnico Profesional y Artística, Jóvenes',
  7: 'Educación Media Técnico Profesional y Artística, Adultos',
  101: 'Educación Media'
};


const COD_DEPE2_MAP = {
  1: 'Municipal',
  2: 'Particular Subvencionado',
  3: 'Particular Pagado (o no subvencionado)',
  4: 'Corporación de Administración Delegada (DL 3166)'
};

const COD_GRADO2_MAP = {
  1 : {
    1: 'Sala Cuna',
    2: 'Nivel Medio Menor',
    3: 'Nivel Medio Mayor',
    4: 'Pre-kinder',
    5: 'Kinder'
  },
  2 : {
    1: '1º Básico',
    2: '2º Básico',
    3: '3º Básico',
    4: '4º Básico',
    5: '5º Básico',
    6: '6º Básico',
    7: '7º Básico',
    8: '8º Básico'
  },

  4 : {
    1: '1º Medio',
    2: '2º Medio',
    3: '3º Medio',
    4: '4º Medio',
  },
  5 : {
    1: '1º Medio',
    2: '2º Medio',
    3: '3º Medio',
    4: '4º Medio',
  },
  101 : {
    1: '1º Medio',
    2: '2º Medio',
    3: '3º Medio',
    4: '4º Medio',
  }

}

export class Matricula {
    dataByYear;

    constructor(private data: any[]) {
      // Group by Year
      this.dataByYear = _.groupBy(data, (d) => d.AGNO);
      _.each(this.dataByYear, (itemsYear, year) => {
        this.dataByYear[year] = this.buildRecordYear(year, itemsYear);
      });
    }

    buildRecordYear(id, items: MatriculaRecord[]) {
      const groupByEnseñanza: any[] = <any> _.groupBy(items, (d) => d['COD_ENSE3']);

      const record = {
        id: id,
        desc: id,
        itemsEnsenanza: _.map(groupByEnseñanza, (itemsEnseñanza: MatriculaRecord[], key) => {
          return this.buildRecordEnseñanza(key, itemsEnseñanza );
        }),
        numeroEstudiantes: items.reduce((memo, d) => d.NUM_ESTUDIANTES + memo, 0)
      };

      // Get union of Enseñanza Media HC (4) & TP (6)
      const itemsEnseñanzaMedia = _.filter(items, (d) => (d['COD_ENSE3'] === '4' || d['COD_ENSE3'] === '6'));
      const idEnseñanzaMedia = '101';
      record.itemsEnsenanza.push(this.buildRecordEnseñanza(idEnseñanzaMedia, itemsEnseñanzaMedia ));

      record.itemsEnsenanza = record.itemsEnsenanza.filter((d) => d.id === '1' || d.id === '2' || d.id === '101');

      return record;
    }

    buildRecordEnseñanza(id, items: MatriculaRecord[]) {
      const groupByGrado = _.groupBy(items, (d: MatriculaRecord) => d.COD_GRADO2);

      const record = {
        id: id,
        desc: COD_ENS3_MAP[id],
        itemsGrado: _.map(groupByGrado, (itemsGrado: MatriculaRecord[], key) => {
          return this.buildRecordGrado(key, itemsGrado, id);
        }),
        numeroEstudiantes: items.reduce((memo, d) => d.NUM_ESTUDIANTES + memo, 0)
      };

      record.itemsGrado = record.itemsGrado.filter((d) => d.id !== '99');
      record.itemsGrado = record.itemsGrado.filter((d) => id !== '1' || (id === '1' && d.id > '3'));
      record.itemsGrado = record.itemsGrado.filter((d) => id !== '101' || (id === '101' && d.id < '5'));

      return record;
    }

    buildRecordGrado(gradoId, items: MatriculaRecord[], enseñanzaId) {
      const groupByDependencias = _.groupBy(items, (d: MatriculaRecord) => d.COD_DEPE2);

      const record = {
        id: gradoId,
        desc: (COD_GRADO2_MAP[enseñanzaId] && COD_GRADO2_MAP[enseñanzaId][gradoId]) || gradoId,
        itemsDependencia: _.map(groupByDependencias, (itemsDep: MatriculaRecord[], key) => {
          return this.buildRecordDependencia(key, itemsDep);
        }),
        numeroEstudiantes: items.reduce((memo, d) => d.NUM_ESTUDIANTES + memo, 0)
      };

      // Remove items from enseñnaza básica and DEOENDENCIA = 4 (Administración delegada)
      record.itemsDependencia = record.itemsDependencia.filter((d) => enseñanzaId !== '2' || (enseñanzaId === '2' && d.id < '4'));


      return record;
    }

    buildRecordDependencia(dependenciaId, items: MatriculaRecord[]) {
      return {
        id: dependenciaId,
        desc: COD_DEPE2_MAP[dependenciaId],
        numeroEstudiantes: items.reduce((memo, d) => d.NUM_ESTUDIANTES + memo, 0)
      };
    }

    getDataForYear(year) {
      const yearData: MatriculaYear = this.dataByYear[year];
      return yearData;
    }

    getData(): MatriculaData {
      return {
        itemsYear: this.dataByYear
      };
    }


    getYears() {
      return _.map(this.dataByYear, (data, year) => year);
    }

}
