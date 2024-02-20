import * as core from '@actions/core'
import {UserError} from "./util";
import {SonarcloudInputs} from "./sonarcloud-inputs";

export type Tool = 'sonar' | 'codeql' | 'semgrep'
const VALID_TOOLS: Tool[] = ['sonar', 'codeql', 'semgrep'];

/**
 * Helper to get all the inputs for the action
 */
export function getTool(): Tool {
    const tool = getRequiredInput('tool') as Tool;
    validateTool(tool)

    return tool
}

export function getSonarcloudInputs(): SonarcloudInputs {
    // const token = getRequiredInput('sonar-token');
    const componentKey = getRequiredInput('sonar-component-key');
    const urlApi = getRequiredInput('sonar-api');

    return { token: '', componentKey, urlApi}
}

export function getRequiredInput(name: string): string {
    const value = core.getInput(name);
    if (!value) {
        throw new UserError(`Input required and not supplied: ${name}`);
    }
    return value;
}

function validateTool(tool: Tool) {
    if (!VALID_TOOLS.includes(tool)) {
        throw new UserError(`Invalid tool "${tool}". The tool must be one of: ${VALID_TOOLS.join(', ')}.`);
    }
}
