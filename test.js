const assert = require('assert');
const renderSql = require('./render-sql.js');

function renderNoCtx(definition) {
  return renderSql.renderSqlDefinition(definition);
}

// First test to get us going
assert.strictEqual(
renderNoCtx({
  name: "meal"
}),
`
CREATE TABLE t_Meal (
  [ID_Meal] INT NOT NULL IDENTITY,
  CONSTRAINT [PK_Meal] PRIMARY KEY([ID_Meal]),
);
GO;
`);

assert.strictEqual(
renderNoCtx({
  name: "point"
}),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

assert.strictEqual(
renderNoCtx({
  name: "two words"
}),
`
CREATE TABLE t_TwoWords (
  [ID_TwoWords] INT NOT NULL IDENTITY,
  CONSTRAINT [PK_TwoWords] PRIMARY KEY([ID_TwoWords]),
);
GO;
`);

assert.strictEqual(
renderNoCtx({
  name: "Meal",
  fields: {
    "kilo calories": { type: { base: "decimal", precision: 16, range: 6 } }
  }
}),
`
CREATE TABLE t_Meal (
  [ID_Meal] INT NOT NULL IDENTITY,
  [KiloCalories] DECIMAL(16, 6) NOT NULL,
  CONSTRAINT [PK_Meal] PRIMARY KEY([ID_Meal]),
);
GO;
`);

assert.strictEqual(
renderNoCtx({
  name: "meal",
  fields: {
    "kilo calories": { type: { base: "decimal", precision: 16, range: 6 } },
    "user rating":   { type: { base: "decimal", precision: 16, range: 6 } }
  }
}),
`
CREATE TABLE t_Meal (
  [ID_Meal] INT NOT NULL IDENTITY,
  [KiloCalories] DECIMAL(16, 6) NOT NULL,
  [UserRating] DECIMAL(16, 6) NOT NULL,
  CONSTRAINT [PK_Meal] PRIMARY KEY([ID_Meal]),
);
GO;
`);

assert.strictEqual(
renderNoCtx({
  name: "point",
  fields: {
    "creator username": { type: { base: "string", limit: 100 } }
  }
}),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  [CreatorUsername] VARCHAR(100) NOT NULL,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

assert.strictEqual(
renderNoCtx({
  name: "point",
  fields: {
    "creator username": { type: { base: "string", limit: 300 } }
  }
}),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  [CreatorUsername] VARCHAR(300) NOT NULL,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

assert.strictEqual(
renderNoCtx({
  name: "point",
  fields: {
    "time created at": { type: { base: "datetime" } }
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

assert.throws(
() => {
renderNoCtx({
  name: "zibble",
  fields: {
    "frobble": { type: { base: "zobble" } }
  }
})});

assert.strictEqual(
renderNoCtx({
  name: "point",
  fields: {
    "time created at": { type: { base: "datetime", optional: true } }
  }
}),
`
CREATE TABLE t_Point (
  [ID_Point] INT NOT NULL IDENTITY,
  [TimeCreatedAt] DATETIME NULL,
  CONSTRAINT [PK_Point] PRIMARY KEY([ID_Point]),
);
GO;
`);

let data = require('./entities.json');
// console.log(data);
// data.entities.forEach(entity => console.log(entity));
console.log(renderNoCtx(data.entities[0]));
console.log(renderNoCtx(data.entities[1]));
