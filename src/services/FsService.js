import { setFailed } from '@actions/core'
import * as fs from 'fs'

export default class FsService {


    setFormatService(instance) {
        this.formatService = instance
    }

    getFormatService() {
        return this.formatService
    }

    setValidateService(instance) {
        this.validateService = instance
    }

    getValidateService() {
        return this.validateService
    }

    setExecService(instance) {
        this.execService = instance
    }
    
    getExecService() {
        return this.execService
    }
    
    getPackageManager(){
        try{
            fs.readFileSync(`./yarn.lock`, 'utf8').toString()
            console.log("Arquivo yarn.lock encontrado!")
            return 'yarn'
        }catch{
            console.log("Arquivo npm encontrado!")
            return 'npm'
        }
    }

    async getModifyVersion(newVersion, path, packageManager){
        try{
            let fileRead = this.getFileRead(path)
            path = fileRead.path
            const defaultVersion = /"version":[\s]+"([v0-9|0-9]+).([0-9]+).([0-9]+)"/
            const defaultScript = /"scripts"\s*:\s*\{[\s\S]*?\}/
            newVersion = newVersion.split(/([a-z]|[A-z])+\.*/).pop()
            
            fileRead = fileRead.contentFile.replace(defaultVersion, `"version": "${newVersion}"`)
           if(this.getValidateService().doesNpmHaveTheChangelogScript(packageManager, fileRead)){
                let scriptAdded = this.setScriptPackageJson(fileRead)
                fileRead = fileRead.replace(defaultScript, scriptAdded)
                this.updatePackageJson(fileRead)
            }

            const fileBase64 = this.getFormatService().base64Encode(fileRead)
            return {
                fileBase64: fileBase64, 
                path:path
            }
        }catch(error){
            console.log(error)
            setFailed('Falha ao atualizar a versão do package.json!')
        }
    }

    setScriptPackageJson(content){
        let scripts = content.split(",")
        let isScript = false
        let newScript = ''
        for(let indice in scripts){
            if(this.getValidateService().isTheStringAcompleteScriptObject(scripts[indice])){
                newScript = scripts[indice]
                newScript = newScript.replace("}", "").trim()
                newScript = newScript.concat(",", `\n    "changelog": "auto-changelog -p" \n}`)
                return newScript            
            }

            if(this.getValidateService().isTheStringTheBeginningOfAscriptObject(scripts[indice])){
                isScript = true                
                newScript = scripts[indice]
            }

            if(this.getValidateService().isTheStringPartOfAscriptObjectAndItsContentDifferentFromTheExistingOne(isScript, scripts[indice], newScript)){
                newScript = newScript.concat("",`${scripts[indice]},`)
            }
           
            if(this.getValidateService().isTheStringTheEndOfAscriptObject(isScript, scripts[indice])){
                isScript = false
                newScript = newScript.replace("}", "").trim()
                newScript = newScript.concat(`\n    "changelog": "auto-changelog -p" \n}`, "")
                return newScript
            }
        }
    }

    getFileRead(path){
        if(path.split('/').length >1 && path.split('/')[0]== ''){
            return {
                contentFile: fs.readFileSync(path.substr(1), 'utf8').toString(),
                path: path.substr(1)
            }
        }
        
        if(path.split('/').length >1 && path.split('/')[0]!= ''){
            return {
                contentFile: fs.readFileSync(path, 'utf8').toString(),
                path: path
            }
        }

        return {
            contentFile: fs.readFileSync(`./package.json`, 'utf8').toString(),
            path: './package.json'
        }
        
    }

    getChangelogFile(){
        const fileRead = fs.readFileSync(`./CHANGELOG.md`, 'utf8').toString()
        return {
            changelogFileName: 'CHANGELOG.md',
            changelogBase64: this.getFormatService().base64Encode(fileRead)
        }
    }

    updatePackageJson(content){
        fs.writeFile('package.json', content, 'utf8', (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Arquivo atualizado com sucesso!');
          });
    }

}