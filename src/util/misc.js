import _ from "lodash";

export function callIfFunction(func, value, fallback = func) {
  if (!!func && typeof func === "function") {
    return func(value);
  }
  return fallback;
}

export function ordered(obj = {}, func = ([k, v]) => v) {
  // convert any entries specified as strings or whatever into objects
  //obj = _.mapValues(obj, (v, k) => ({ id: k, ...(typeof v === "object" ? v : { label: v }) }));

  // make sure any sub-objects in obj have an id
  Object.entries(obj).forEach(([k, v]) => {
    if (typeof v === "object" && !v.hasOwnProperty("id")) {
      v.id = k;
    }
  });

  // generate a sort order
  const sortedArray = Object.entries(obj).sort(func);
  obj[Symbol.iterator] = sortedArray.iterator;
  return obj;
}

const sortDescendingIndicators = ["desc", "d", "descending", -1];

// FIXME not very efficient
// TODO accept strings instead of sublists
export function compare(...keyDirections) {
  return ([aKey, aVal], [bKey, bVal]) => {
    for (const kd in keyDirections) {
      const [key, direction] = Array.isArray(kd) ? keyDirections[kd] : [kd, 1];
      const mult = _.includes(sortDescendingIndicators, direction) ? -1 : 1;
      if (aVal[key] === bVal[key]) {
        continue;
      }
      return aVal[key] < bVal[key] ? -mult : mult;
    }
  };
}

//TODO move to tests
/*const x = ordered({ a: 1, b: 2 });
console.log(x.a);

for (const y in x) {
  console.log(y, x[y]);
}*/

export function get(option, property = "id", defaultValue = option) {
  return _.get(option, property, defaultValue);
}
