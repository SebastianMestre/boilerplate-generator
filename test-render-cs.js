const assert = require('assert');
const renderCs = require('./render-cs.js');
const {makeDef, makeString, makeDecimal} = require('./test-utils.js');

function renderNoCtx(definition) {
  return renderCs.renderCsDefinition(definition);
}

// first test to get us going
assert.strictEqual(renderNoCtx({ name: "person" }),
`
public class Person
{
}
`);


// use a different name to force us to compute the name
assert.strictEqual(renderNoCtx({ name: "client" }),
`
public class Client
{
}
`);

// use a two word name to force us to look at every word
assert.strictEqual(renderNoCtx({ name: "physical location" }),
`
public class PhysicalLocation
{
}
`);
