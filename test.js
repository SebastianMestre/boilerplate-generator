const assert = require('assert');
const renderSql = require('./render-sql.js');

function renderNoCtx(definition) {
  return renderSql.renderSqlDefinition(definition);
}

function makeDecimal(precision, range) {
  return { type: "decimal", precision, range };
}

function makeString(limit) {
  return { type: "string", limit };
}

function makeDef(name, fields) {
  return {name, fields};
}

// First test to get us going
assert.strictEqual(
renderNoCtx({ name: "meal" }),
`
CREATE TABLE t_Meal (
  [ID_Meal] INT NOT NULL IDENTITY,
  CONSTRAINT [PK_Meal] PRIMARY KEY([ID_Meal]),
);
GO;
`);

// use a different name, force us out of using a constant
assert.strictEqual(
renderNoCtx({ name: "point" }),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

// use two words, force us out of hard-coding the name for a single word
assert.strictEqual(
renderNoCtx({ name: "two words" }),
`
CREATE TABLE t_TwoWords (
  [ID_TwoWords] INT NOT NULL IDENTITY,
  CONSTRAINT [PK_TwoWords] PRIMARY KEY([ID_TwoWords]),
);
GO;
`);

// force us to check for fields
assert.strictEqual(
renderNoCtx(makeDef("meal", { "kilo calories": makeDecimal(16, 6) })),
`
CREATE TABLE t_Meal (
  [ID_Meal] INT NOT NULL IDENTITY,
  [KiloCalories] DECIMAL(16, 6) NOT NULL,
  CONSTRAINT [PK_Meal] PRIMARY KEY([ID_Meal]),
);
GO;
`);

// force us to check for multiple fields
assert.strictEqual(
renderNoCtx(makeDef("meal", {
  "kilo calories": makeDecimal(16, 6),
  "user rating": makeDecimal(16, 6)
})),
`
CREATE TABLE t_Meal (
  [ID_Meal] INT NOT NULL IDENTITY,
  [KiloCalories] DECIMAL(16, 6) NOT NULL,
  [UserRating] DECIMAL(16, 6) NOT NULL,
  CONSTRAINT [PK_Meal] PRIMARY KEY([ID_Meal]),
);
GO;
`);

// force us to check for string fields
assert.strictEqual(
renderNoCtx(makeDef("point", { "creator username": makeString(100) })),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  [CreatorUsername] VARCHAR(100) NOT NULL,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

// force us to handle different limits on string fields
assert.strictEqual(
renderNoCtx(makeDef("point", { "creator username": makeString(300) })),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  [CreatorUsername] VARCHAR(300) NOT NULL,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

// force us to check for datetime fields. we do a nice refactor at this point
assert.strictEqual(
renderNoCtx({
  name: "point",
  fields: {
    "time created at": { type: "datetime" }
  }
}),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  [TimeCreatedAt] DATETIME NOT NULL,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

// force us to check for invalid types
assert.throws(() =>
  renderNoCtx(makeDef("zibble", { "frobble": { type: "zobble" } })));

// force us to check for optional. We do some refactoring again
assert.strictEqual(
renderNoCtx(makeDef("point", { "time created at": { type: "datetime", optional: true } })),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  [TimeCreatedAt] DATETIME NULL,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

// at this point I started implementing 'foreign keys' by iterating on the REPL.
// not TDD, but I feel it achieves some of the same goals. TODO: add some tests
// after-the-fact to prevent regression.
let data = require('./entities.json');
// console.log(data);
// data.entities.forEach(entity => console.log(entity));
console.log(renderNoCtx(data.entities[0]));
console.log(renderNoCtx(data.entities[1]));
