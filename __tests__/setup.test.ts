// Resources
process.env.AVOID_AUTOSTART = 'true';
// Modules
import path from 'path';
import { removeSync, mkdirSync, copySync, pathExistsSync } from 'fs-extra';
// LIBs
jest.mock('../src/utils/prompt');
jest.mock('../src/utils/git');
import { promptForAnswer } from '../src/utils/prompt';
import { clone as gitClone } from '../src/utils/git';
import { main } from '../setup';
// Triggers
const mockedPromptForAnswer = promptForAnswer as jest.Mock<Promise<string>>;
const mockedGitClone = gitClone as jest.Mock<Promise<void>>;

describe('Testing generated ouput files', () => {
    const outputPath: string = path.join(__dirname, 'tmp-output');
    const projectTemplateFolder: string = path.join(__dirname, '../_templates');
    const removeTemplatesFolder = () => removeSync(projectTemplateFolder);

    beforeAll(() => {
        removeSync(outputPath);
        mkdirSync(outputPath);
    });

    beforeEach(() => {
        removeTemplatesFolder();
    });

    afterEach(() => {
        removeTemplatesFolder();
        jest.clearAllMocks();
    });

    describe('should not fail', () => {
        it('should generate the expected output files', async () => {
            mockedPromptForAnswer.mockImplementation(async () => {
                return 'y';
            });
            mockedGitClone.mockImplementation(async () => {
                copySync('./__tests__/templates/template_one', projectTemplateFolder);
            });
            await main({
                generator: 'docker-node-lts',
                output: outputPath,
            });
            expect(pathExistsSync(`${outputPath}/.dockerignore`)).toBeTruthy();
            expect(pathExistsSync(`${outputPath}/Dockerfile`)).toBeTruthy();
        });
    });
});
