function toPascalCase(str) {
  return str.split(" ").map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join('');
}

function renderSqlRowBaseType(typeData) {
  switch (typeData.base) {
    case  "decimal": return `DECIMAL(16, 6)`;
    case   "string": return `VARCHAR(${typeData.limit})`;
    case "datetime": return `DATETIME`;
    case      "int": return `INT`;
    default: throw new Error(`Unexpected field base type: ${typeData.base}`);
  }
}

function renderSqlRowType(typeData) {
  let result = renderSqlRowBaseType(typeData);
  if (typeData.optional) {
    result = result + " NULL";
  } else {
    result = result + " NOT NULL";
  }
  return result;
}

function renderPreprocessedSqlRow(fieldName, typeData) {
    const type = renderSqlRowType(typeData);
    return `[${fieldName}] ${type}`;
}

function renderSqlRow(field, fieldData) {
  if (fieldData.type.base == "relation-out") {
    const fieldName = `ID_${toPascalCase(fieldData.type.target)}`;
    return renderPreprocessedSqlRow(fieldName, { base: "int" });
  } else {
    const fieldName = toPascalCase(field);
    return renderPreprocessedSqlRow(fieldName, fieldData.type);
  }
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
