const { toPascalCase } = require('./utils.js');

function renderCsDefinition(definition) {
  const className = toPascalCase(definition.name);

  let renderedFields = ""
  for (let field in definition.fields) {
    const fieldName = toPascalCase(field);
    renderedFields += `  public Decimal ${fieldName} { get; private set; }` + "\n";
  }

  return `
public class ${className}
{
${renderedFields}}
`
}

module.exports = {
  renderCsDefinition: renderCsDefinition,
};
