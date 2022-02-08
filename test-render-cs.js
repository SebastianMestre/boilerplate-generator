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

// add a field to make us look at fields
assert.strictEqual(renderNoCtx(makeDef("physical location", { "latitude": makeDecimal(10, 3) })),
`
public class PhysicalLocation
{
  public Decimal Latitude { get; private set; }
}
`);

// add another field to make us look at all fields
assert.strictEqual(renderNoCtx(makeDef("physical location", { "latitude": makeDecimal(10, 3), "longitude": makeDecimal(10, 3) })),
`
public class PhysicalLocation
{
  public Decimal Latitude { get; private set; }
  public Decimal Longitude { get; private set; }
}
`);
