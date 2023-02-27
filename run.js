import { setFailed } from '@actions/core'
import ActionController from './src/controllers/ActionController.js'

async function run() {
    try {
        const actionController = new ActionController()
        await actionController.changelog()
    } catch (e) {
        setFailed(`Essa ação só será executada em uma Pull Request.\nERRO: ${e}.`)
    }
}
run()