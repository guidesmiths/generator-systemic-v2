// Modules
import colors from 'colors';
import { readFileSync, existsSync } from 'fs-extra';
import { parseDocument } from 'yaml';
import { get, isEmpty } from 'lodash';

export function version(): void {
  const version: string = process.version.split('.')[0];
  const recommendedVersion: string = `v${process.env.npm_package_engines_node.split('.')[0]}`;

  if (version !== recommendedVersion) {
    console.log(colors.yellow(
      `Your NodeJS version ${version} is not recommended to use on this project.
      Recommended version: ${recommendedVersion}`,
    ));
  }
}

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

export function testOutputFiles(generatorsList: string[], outputFolder: string) {
  console.log(colors.bold(`\nRunning generators output files testing`), '...\n');
  const outputTestError = generatorsList
    .map(generatorName => `./_templates/generator/${generatorName}/output.yaml`)
    .filter(generatorOutputTestPath => existsSync(generatorOutputTestPath))
    .map(generatorOutputTestPath => {
      const yamlFile = readFileSync(generatorOutputTestPath, 'utf-8');
      const parsedYaml = parseDocument(yamlFile);
      const expected = get(parsedYaml, 'contents.items');
      const { value: folder } = (expected.find(({ key }) => key.value === 'folder')).value;
      const files = ((expected.find(({ key }) => key.value === 'files')).value.items).map(({ value }) => value);
      return checkFileExists(`${outputFolder}/${folder}`, files);
    });

  if (!isEmpty(outputTestError)) {
    process.exit(1);
  }
}
