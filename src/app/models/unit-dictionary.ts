import * as _ from "lodash";


/** 
 * A recursive dictionary that allows to set & get objects with multiple keys (dimensions)
 */
export class UnitDictionary {
  value:any;
  branches:{} = {};

  constructor() {

  }

  set(focus, value) {
    let focusKeys = _.keys(focus).sort();

    
    if (focusKeys.length==0) {
      // We dont have defined a focus, we store the valuein this Dictionary
      this.value = value;
    } else {
      // We do have a focus, we will create a new Dictionary (Branch) associated to the first key of our focus
      // and set teh value recursevly using the "rest" of the focus

      let firstKey = _.first(focusKeys);
      let nextFocus = _.omit(focus,firstKey);

      /**
       * We use a recursive data structure to store values associated to a sequence of keys (dimensions)
       * E.g. branches = {
       *   brand : {
       *      NESTLE : {
       *          value : 123,
       *          branches : {
       *            division : {
       *              GC : {
       *                value: 456,
       *                branches : null;
       *              }
       *              SSNY : {
       *                branches: {...}
       *              }
       *            }
       *          }
       *       }
       *    }
       * }
       */
      this.branches[firstKey] = this.branches[firstKey] || {};
      let branchDict = this.branches[firstKey][focus[firstKey]] = this.branches[firstKey][focus[firstKey]] || new UnitDictionary();

      branchDict.set(nextFocus, value);
    }
  }

  get(focus) {
    let focusKeys = _.keys(focus).sort();

    if (focusKeys.length==0) {
      return this.value;
    } else {
      let focusKeys = _.keys(focus).sort();
      let firstKey = _.first(focusKeys);
      let nextFocus = _.omit(focus,firstKey);

      if (this.branches[firstKey] && this.branches[firstKey][focus[firstKey]]) {
        let branchDict = this.branches[firstKey][focus[firstKey]];
        return branchDict.get(nextFocus);
      } else {
        return null;
      }
    }
  }
}

