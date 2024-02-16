import * as core from "@actions/core";
import * as github from '@actions/github';

type EndpointType = 'upload' | 'trigger'
const PIXEE_SAMBOX_URL = 'https://d22balbl18.execute-api.us-east-1.amazonaws.com/prod'

export function buildApiUrl(type: EndpointType, url: string, prNumber: number | null, tool?: string) {
    const customUrl = url ? url : PIXEE_SAMBOX_URL
    const {owner, repo, number, sha} = getGithubContext()

    if (type === 'upload') {
        return `${customUrl}/analysis-input/${owner}/${repo}/${sha}/${tool}`
    }

    return `${customUrl}/analysis-input/${owner}/${repo}/${prNumber ?? number}`
}

export function getGithubContext() {
    const {sha, issue: {owner, repo, number}} = github.context

    console.log('getPullRequestHeadSha: ', getPullRequestHeadSha())
    console.log('sha: ', sha)

    return {owner, repo, number: number ?? getPullRequestNumber(), sha: getPullRequestHeadSha()}
}

function getPullRequestHeadSha(){
   return  github.context.payload.check_run.head_sha;
}

function getPullRequestNumber() {
    return github.context.payload.check_run.pull_requests[0].number
}

export function wrapError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

export function buildError(unwrappedError: unknown) {
    const error = wrapError(unwrappedError);
    const message = error.message;
    core.setFailed(message);
    return;
}

export class UserError extends Error {
    constructor(message: string) {
        super(message);
    }
}
