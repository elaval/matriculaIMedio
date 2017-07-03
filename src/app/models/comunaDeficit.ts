import * as _ from 'lodash';
import { ComunaDeficitRaw } from 'app/services/data-providers/api-provider.service';


export class ComunaDeficit {
  matriculaINoMunicipal: number;
  outfluxIntracomunal: number;
  outfluxIntercomunal: number;
  conversionParticularInterna: number;
  influjoADExterno: number;
  influjoADInterno: number;
  matriculaPSI: number;
  deficit: number;
  comuna: string;
  inmigracionComunal: number;
  emigracionComunal: number;
  inmigracionEdMunicipalComunal: number;
  emigracionEdMunicipalComunal: number;
  influjoAD: number;
  influjoPPExterno: number;
  influjoPPInterno: number;
  outflujoPPExterno: number;
  outflujoPPInterno: number;
  outflujoADExterno: number;
  outflujoADInterno: number;
  outflujoPSExterno: number;
  outflujoPSInterno: number;
  outflujoMunExterno: number;
  outflujoMunInterno: number;
  influjoPSExterno: number;
  influjoPSInterno: number;
  influjoMunExterno: number;
  influjoMunInterno: number;
  matriculaI: number;
  matricula8vo: number;
  ;

    constructor(private data: ComunaDeficitRaw) {
      this.comuna = data.COMUNA;
      this.matricula8vo = +data.MATRICULA_2015_MUN;
      this.matriculaI = +data.MATRICULA_2016_MUN;
      this.matriculaINoMunicipal = +data.MATRICULA_2016_PS + +data.MATRICULA_2016_AD + +data.MATRICULA_2016_PP;




      this.matriculaPSI = +data.MATRICULA_2015_PS;

      this.deficit = this.matricula8vo - this.matriculaI;
      this.influjoMunInterno = +data.FLOW_2016_MUN_MUN_SAME;
      this.influjoMunExterno = +data.FLOW_2016_MUN_MUN - +data.FLOW_2016_MUN_MUN_SAME;
      this.influjoPSInterno = +data.FLOW_2016_PS_MUN_SAME;
      this.influjoPSExterno = +data.FLOW_2016_PS_MUN - +data.FLOW_2016_PS_MUN_SAME;
      this.influjoPPInterno = +data.FLOW_2016_PP_MUN_SAME;
      this.influjoPPExterno = +data.FLOW_2016_PP_MUN - +data.FLOW_2016_PP_MUN_SAME;
      this.influjoADInterno = +data.FLOW_2016_AD_MUN_SAME;
      this.influjoADExterno = +data.FLOW_2016_AD_MUN - +data.FLOW_2016_AD_MUN_SAME;

      this.outflujoMunExterno = +data.FLOW_2015_MUN_MUN - +data.FLOW_2015_MUN_MUN_SAME;
      this.outflujoPSInterno = +data.FLOW_2015_MUN_PS_SAME;
      this.outflujoPSExterno = +data.FLOW_2015_MUN_PS - +data.FLOW_2015_MUN_PS_SAME;
      this.outflujoADInterno = +data.FLOW_2015_MUN_AD_SAME;
      this.outflujoADExterno = +data.FLOW_2015_MUN_AD - +data.FLOW_2015_MUN_AD_SAME;
      this.outflujoPPInterno = +data.FLOW_2015_MUN_PP_SAME;
      this.outflujoPPExterno = +data.FLOW_2015_MUN_PP - +data.FLOW_2015_MUN_PP_SAME;

      this.emigracionEdMunicipalComunal = this.outflujoMunExterno
        + this.outflujoPSInterno + this.outflujoPSExterno
        + this.outflujoPPInterno + this.outflujoPPExterno
        + this.outflujoADInterno + this.outflujoADExterno
        ;

      this.inmigracionEdMunicipalComunal = this.influjoMunExterno
        + this.influjoPSInterno + this.influjoPSExterno
        + this.influjoPPInterno + this.influjoPPExterno
        + this.influjoADInterno + this.influjoADExterno;
        ;

      this.conversionParticularInterna =
        + this.outflujoPSInterno - this.influjoPSInterno
        + this.outflujoPPInterno - this.influjoPPInterno
        + this.outflujoADInterno - this.influjoADInterno
        ;

      this.emigracionComunal = this.outflujoMunExterno + this.outflujoPSExterno + this.outflujoADExterno + this.outflujoPPExterno;
      this.inmigracionComunal = this.influjoMunExterno + this.influjoPSExterno + this.influjoPPExterno + this.influjoADExterno;

      this.outfluxIntercomunal = this.emigracionComunal - this.inmigracionComunal;
      this.outfluxIntracomunal =  - (+this.influjoPSInterno - this.outflujoPSInterno
                                  + this.influjoPPInterno - this.outflujoPPInterno
                                  + this.influjoADInterno - this.outflujoADInterno);



    }

    hasDeficit() {
      return this.deficit > 0;
    }

    isExporter() {
      const emigracionNeta = this.emigracionComunal - this.inmigracionComunal;
      return (emigracionNeta >= this.deficit / 2);
    }

    isImporter() {
      const inmigracionNeta = - this.emigracionComunal + this.inmigracionComunal;
      return  (inmigracionNeta >= -this.deficit / 2) && -this.deficit > 0;
    }

    isConversaParticular() {
      return  (this.conversionParticularInterna >= this.deficit / 2) && this.deficit > 0;
    }

    isConversaMunicipal() {
      return  (-this.conversionParticularInterna >= -this.deficit / 2) && this.deficit < 0;
    }


}
