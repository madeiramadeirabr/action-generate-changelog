import { getInput } from '@actions/core'
let githubDTO = {
    githubToken: getInput('github-token'),
    filePath: core.getInput('path')
}

export default githubDTO