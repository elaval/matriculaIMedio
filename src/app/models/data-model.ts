export interface DataModel {
  AGNO: string;
  REGION: string;
  COMUNA: string;
  DEPROV: string;
  DEPENDENCIA: string;
  RURALIDAD: string;
  MATRICULA_TOTAL: number;
  MATRICULA_TOTAL_LY: number;
}

export const dimensionAlias = {
  'año': 'AGNO',
  'ano': 'AGNO',
  'agno': 'AGNO',
  'comuna': 'COMUNA',
  'region': 'REGION',
  'dependencia': 'DEPENDENCIA',
  'rural': 'RURALIDAD',
  'ruralidad': 'RURALIDAD'

};

export let dimensionAliases = dimensionAlias;

export const dimensionNames = [
    'AGNO',
    'REGION',
    'COMUNA',
    'DEPROV',
    'DEPENDENCIA',
    'RURALIDAD'
];

export interface Focus {
  REGION?: string;
  COMUNA?: string;
  DEPROV?: string;
  DEPENDENCIA?: string;
  RURALIDAD?: string;
  AGNO?: string;
}

export const metricNames = [
    'MATRICULA_TOTAL',
    'MATRICULA_TOTAL_LY'
];

export let orderValue = (d) => {
  return d['MATRICULA_TOTAL'];
};

export let getMainMetric = (d) => {
  return d['MATRICULA_TOTAL'];
};


export let getMetricLY = (d) => {
  return d['MATRICULA_TOTAL_LY'];
};


export const addReduceFunctions = {
    'add' : function(p, v) {

      const ty = p.MATRICULA_TOTAL + (+v.MATRICULA_TOTAL);
      const ly = p.MATRICULA_TOTAL_LY + (+v.MATRICULA_TOTAL_LY);

      return {
        'MATRICULA_TOTAL' : ty,
        'MATRICULA_TOTAL_LY' : ly,
        'growth' : ty && ly ? ( ty / ly ) - 1 : 0,
        'growth_amount' : ty - ly,
        'count': p.count + 1

      };
    },
    'remove' : function(p, v) {

      const ty = p.MATRICULA_TOTAL - (+v.MATRICULA_TOTAL);
      const ly = p.MATRICULA_TOTAL_LY - (+v.MATRICULA_TOTAL_LY);

      return {
        'MATRICULA_TOTAL' : ty,
        'MATRICULA_TOTAL_LY' : ly,
        'growth' : ty && ly ? ( ty / ly ) - 1 : 0,
        'growth_amount' : ty - ly,
        'count': p.count - 1

      };
    },
    'initial' : function() { return {
      'MATRICULA_TOTAL' : 0,
      'MATRICULA_TOTAL_LY' : 0,
      'growth' : 0,
      'growth_amount' : 0,
      'count': 0
    }; }
  };
