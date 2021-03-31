// Modules
import colors from 'colors';

export function version(): void {
  const version = process.version.split('.')[0];
  const recommendedVersion = `v${process.env.npm_package_engines_node.split('.')[0]}`;

  if (version !== recommendedVersion) {
    console.log(colors.yellow(
      `Your NodeJS version ${version} is not recommended to use on this project. Recommended version: ${recommendedVersion}`,
    ));
  }
}
