import { exec } from '@actions/exec'

export default class Exec {

    async installDependencies(packageManager) {
        if(packageManager == 'yarn'){
            await exec(`${packageManager} install --ignore-workspace-root-check`)
            return 
        }
        await exec(`${packageManager} install`)
    }

    async generateChangelog(packageManager){
        if (packageManager == 'yarn'){
            await exec(`${packageManager} add auto-changelog --dev --ignore-workspace-root-check`)
            await exec(`${packageManager} auto-changelog -p`)
            return
        }

        await exec(`${packageManager} install auto-changelog --save-dev --ignore-workspace-root-check`)
        await exec(`${packageManager} run changelog`)
    }
}