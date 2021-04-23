// Modules
import colors from 'colors';
import { readFileSync, existsSync } from 'fs-extra';
import { parseDocument } from 'yaml';
import { get, isEmpty, isNil } from 'lodash';

function checkFileExists(folder: string, files: string[]): string[] {
  return files
    .map(file => `${folder}${file}`)
    .filter(path => {
      console.log(colors.grey(`Validating output generator path: ${path}`));
      return !existsSync(path)
    })
    .map(path => {
      console.log(colors.red(`File ${path} does not exists, check this generator`));
      return path;
    });
}

export function testOutputFiles(generatorsList: string[], outputFolder: string): void {
  console.log(colors.bold(`\nRunning generators output files testing`), '...\n');
  const outputTestError: string[][] = generatorsList
    .map(generatorName => ({
      name: generatorName,
      path: `./_templates/generator/${generatorName}/output.yaml`,
    }))
    .filter(({ name, path }) => {
      const exists = existsSync(path);
      if (!exists) {
        console.log(colors.yellow(`⚠ Generator ${name} is missing testing file "output.yaml" ⚠`));
      }
      return exists;
    })
    .map(({ path: generatorOutputTestPath }) => {
      const yamlFile = readFileSync(generatorOutputTestPath, 'utf-8');
      const parsedYaml = parseDocument(yamlFile);
      const expected = get(parsedYaml, 'contents.items');
      const { value: folder } = (expected.find(({ key }) => key.value === 'folder')).value;
      const files = ((expected.find(({ key }) => key.value === 'files')).value.items).map(({ value }) => value);
      return checkFileExists(`${outputFolder}/${folder}`, files);
    });

  if (!isEmpty(outputTestError) && !isNil(outputTestError[0][0])) {
    process.exit(1);
  }
}
