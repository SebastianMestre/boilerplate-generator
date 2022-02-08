const { toPascalCase } = require('./utils.js');

function renderCsDefinition(definition) {
  const className = toPascalCase(definition.name);
  return `
public class ${className}
{
}
`
}

module.exports = {
  renderCsDefinition: renderCsDefinition,
};
