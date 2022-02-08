
function makeDecimal(precision, range) {
  return { type: "decimal", precision, range };
}

function makeString(limit) {
  return { type: "string", limit };
}

function makeDef(name, fields) {
  return {name, fields};
}

module.exports = {
  makeDef: makeDef,
  makeString: makeString,
  makeDecimal: makeDecimal,
};
