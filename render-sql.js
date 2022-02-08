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

function preprocessDefinition(entity) {
  const preprocessedRows = [];

  for (const field in entity.fields) {
    const fieldData = entity.fields[field];
    const bareData = preprocessSqlRow(field, fieldData);
    preprocessedRows.push(bareData);
  }

  return {
    name: entity.name,
    columns: preprocessedRows,
  };
}

function renderTable(table) {
  const PascalCasedName = toPascalCase(table.name);

  const tableName = `t_${PascalCasedName}`;
  const primaryKeyRow = `ID_${PascalCasedName}`;

  const formattedRows = [
    `[${primaryKeyRow}] INT NOT NULL IDENTITY`,
  ];

  const formattedConstraints = [
    `CONSTRAINT [PK_${PascalCasedName}] PRIMARY KEY([${primaryKeyRow}])`,
  ];

  for (const bareData of table.columns) {
    const formattedRow = renderPreprocessedSqlRow(bareData);
    formattedRows.push(formattedRow);
  }

  const lines = [...formattedRows, ...formattedConstraints];

  const formatLine = arr => arr.map(x => "  " + x + ",\n").join("");
  const formattedLines = formatLine(lines);

  return `
CREATE TABLE ${tableName} (
${formattedLines});
GO;
`;
}

function renderSqlDefinition(entity) {
  const tableData = preprocessDefinition(entity);
  return renderTable(tableData);
}

module.exports = {
  renderSqlDefinition: renderSqlDefinition
};
