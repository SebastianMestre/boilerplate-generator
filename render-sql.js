const { toPascalCase } = require('./utils.js');

function renderSqlDefinition(entity) {
  const tableData = convertEntityToTable(entity);
  return renderTable(tableData);
}

function convertEntityToTable(entity) {

  const tableName = toPascalCase(entity.name);
  const columns = [
    {
      name: `ID_${tableName}`,
      type: 'int',
      identity: true,
    }
  ];

  const constraints = [
    {
      name: `PK_${tableName}`,
      type: 'primary',
      target: `ID_${tableName}`,
    }
  ];

  for (const field in entity.fields) {
    const columnData = convertFieldToSqlColumn(field, entity.fields[field]);
    columns.push(columnData);
  }

  const result = {
    formattedName: `t_${tableName}`,
    columns,
    constraints,
  };
  return result;
}

function convertFieldToSqlColumn(field, fieldData) {
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

function renderTable(table) {

  const tableName = table.formattedName;

  const formattedConstraints = table.constraints.map(renderSqlConstraint);
  const formattedColumns = table.columns.map(renderSqlColumn);

  const lines = [...formattedColumns, ...formattedConstraints];

  const formatLine = line => "  " + line + ",\n";
  const formattedLines = lines.map(formatLine).join("");

  return `
CREATE TABLE ${tableName} (
${formattedLines});
GO;
`;
}

function renderSqlConstraint(constraint) {
  return `CONSTRAINT [${constraint.name}] PRIMARY KEY([${constraint.target}])`;
}

function renderSqlColumn(bareData) {
    const type = renderSqlColumnType(bareData);
    return `[${bareData.name}] ${type}`;
}

function renderSqlColumnType(rowData) {
  let result = renderSqlRowBaseType(rowData);

  if (rowData.optional)
    result += " NULL";
  else
    result += " NOT NULL";

  if (rowData.identity)
    result += " IDENTITY";

  return result;
}

function renderSqlRowBaseType(rowData) {
  switch (rowData.type) {
    case  "decimal": return `DECIMAL(${rowData.precision}, ${rowData.range})`;
    case   "string": return `VARCHAR(${rowData.limit})`;
    case "datetime": return `DATETIME`;
    case      "int": return `INT`;
    default: throw new Error(`Unexpected field base type: ${rowData.type}`);
  }
}

module.exports = {
  renderSqlDefinition: renderSqlDefinition
};
