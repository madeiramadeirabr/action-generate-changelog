import { setFailed } from '@actions/core'
import * as fs from 'fs'

export default class FsService {


    setFormatService(instance) {
        this.formatService = instance
    }

    getFormatService() {
        return this.formatService
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

    async  getModifyVersion(newVersion, path, packageManager){
        try{
            let fileRead = this.getFileRead(path)
            path = fileRead.path
            const defaultVersion = /"version":[\s]+"([v0-9|0-9]+).([0-9]+).([0-9]+)"/
            newVersion = newVersion.split(/([a-z]|[A-z])+\.*/).pop()
            fileRead = fileRead.contentFile.replace(defaultVersion, `"version": "${newVersion}"`)
            const scriptsDefault = /"scripts"\s*:\s*\{[\s\S]*?\}/
            if(packageManager == 'npm'){
                fileRead = fileRead.replace(scriptsDefault, `"scripts": {\n     "changelog": "auto-changelog -p" \n}`)
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
}