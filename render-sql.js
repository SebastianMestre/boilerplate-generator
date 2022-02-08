const { toPascalCase } = require('./utils.js');

function renderSqlRowBaseType(rowData) {
  switch (rowData.type) {
    case  "decimal": return `DECIMAL(${rowData.precision}, ${rowData.range})`;
    case   "string": return `VARCHAR(${rowData.limit})`;
    case "datetime": return `DATETIME`;
    case      "int": return `INT`;
    default: throw new Error(`Unexpected field base type: ${rowData.type}`);
  }
}

function renderSqlRowType(rowData) {
  let result = renderSqlRowBaseType(rowData);
  if (rowData.optional) {
    result += " NULL";
  } else {
    result += " NOT NULL";
  }
  return result;
}

function renderPreprocessedSqlRow(bareData) {
    const type = renderSqlRowType(bareData);
    return `[${bareData.name}] ${type}`;
}

function preprocessSqlRow(field, fieldData) {
  if (fieldData.type == "relation-out")
    return {
      name: `ID_${toPascalCase(fieldData.target)}`,
      type: "int",
    };
  else
    return {
      name: toPascalCase(field),
      ...fieldData,
    };
}

function renderSqlRow(field, fieldData) {
  let bareData = preprocessSqlRow(field, fieldData);
  return renderPreprocessedSqlRow(bareData);
}

function renderSqlDefinition(entity) {
  const PascalCasedName = toPascalCase(entity.name);

  const tableName = `t_${PascalCasedName}`;
  const primaryKeyRow = `ID_${PascalCasedName}`;

  const rows = [
    `[${primaryKeyRow}] INT NOT NULL IDENTITY`,
  ];

  const constraints = [
    `CONSTRAINT [PK_${PascalCasedName}] PRIMARY KEY([${primaryKeyRow}])`,
  ];

  for (let field in entity.fields) {
    rows.push(renderSqlRow(field, entity.fields[field]));
  }

  const lines = [...rows, ...constraints];

  const formatLine = arr => arr.map(x => "  " + x + ",\n").join("");
  const formattedLines = formatLine(lines);

  return `
CREATE TABLE ${tableName} (
${formattedLines});
GO;
`;
}

module.exports = {
  renderSqlDefinition: renderSqlDefinition
};
