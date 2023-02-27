import { getInput } from '@actions/core'
import * as github from '@actions/github'
let githubDTO = {
    githubToken: getInput('github-token'),
    filePath: core.getInput('path'),
    github: github,
    owner: github.context.payload.repository.owner.name,
    repo: github.context.payload.repository.name
}

export default githubDTO