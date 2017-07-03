export interface DataModel {
    RBD: number;
    COD_REG_RBD: string;
    COD_PRO_RBD: string;
    COD_COM_RBD: string;
    NOM_COM_RBD: string;
    COD_DEPROV_RBD: string;
    NOM_DEPROV_RBD: string;
    COD_DEPE: string;
    COD_DEPE2: string;
    DEPENDENCIA: string;
    RURAL_RBD: string;
    LATITUD: number;
    LONGITUD: number;
    CONVENIO_PIE: string;
    ESTADO_ESTAB: string;
    ORI_RELIGIOSA: string;
    ORI_OTRO_GLOSA: string;
    PAGO_MATRICULA: string;
    PAGO_MENSUAL: string;
    MAT_TOTAL_LY: number;
    MAT_TOTAL_TY: number;
}

export const dimensionAlias = {
  'comuna': 'NOM_COM_RBD',
  'region': 'COD_REG_RBD',
  'dependencia': 'DEPENDENCIA',
  'rural': 'RURAL_RBD',
  'ruralidad': 'RURAL_RBD'

};

export let dimensionAliases = dimensionAlias;

export const dimensionNames = [
    'COD_REG_RBD',
    'NOM_COM_RBD',
    'NOM_DEPROV_RBD',
    'DEPENDENCIA',
    'RURAL_RBD'
];

export interface Focus {
  COD_REG_RBD?: string;
  NOM_COM_RBD?: string;
  NOM_DEPROV_RBD?: string;
  DEPENDENCIA?: string;
  RURAL_RBD?: string;
}

export const metricNames = [
    'MAT_TOTAL_LY',
    'MAT_TOTAL_TY'
];

export let orderValue = (d) => {
  return d['MAT_TOTAL_TY'];
};

export const addReduceFunctions = {
    'add' : function(p, v) {

      const ty = p.MAT_TOTAL_TY + (+v.MAT_TOTAL_TY);
      const ly = p.MAT_TOTAL_LY + (+v.MAT_TOTAL_LY);

      return {
        'MAT_TOTAL_TY' : ty,
        'MAT_TOTAL_LY' : ly,
        'growth' : ty && ly ? ( ty / ly ) - 1 : 0,
        'growth_amount' : ty - ly,
        'count': p.count + 1

      };
    },
    'remove' : function(p, v) {

      const ty = p.MAT_TOTAL_TY - (+v.MAT_TOTAL_TY);
      const ly = p.MAT_TOTAL_LY - (+v.MAT_TOTAL_LY);

      return {
        'MAT_TOTAL_TY' : ty,
        'MAT_TOTAL_LY' : ly,
        'growth' : ty && ly ? ( ty / ly ) - 1 : 0,
        'growth_amount' : ty - ly,
        'count': p.count - 1

      };
    },
    'initial' : function() { return {
      'MAT_TOTAL_TY' : 0,
      'MAT_TOTAL_LY' : 0,
      'growth' : 0,
      'growth_amount' : 0,
      'count': 0
    }; }
  };
