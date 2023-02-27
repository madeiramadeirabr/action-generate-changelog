import { setFailed } from '@actions/core'
import GithubService from "../services/GithubService.js"
import FsService from '../services/FsService.js'
import ExecService from '../services/ExecService.js'
import githubDTO from'../dto/githubDTO.js';
import ValidateService from '../services/ValidateService.js';
import FormatService from '../services/FormatService.js';

export default class ActionController{
    constructor(){
        const {githubToken, filePath} = githubDTO
        this.setGithubToken(githubToken)
        this.setFilePath(filePath)
        this.setValidateService(new ValidateService())
        this.setFsService(new FsService())
        this.setExecService(new ExecService())
        this.setFormatService(new FormatService())
        this.getFsService().setFormatService(this.getFormatService())
    }

    getValidateService(){
        return this.validateService
    }

    setValidateService(instance){
        this.validateService = instance
    }

    setFsService(instance){
        this.fsService = instance
    }
    
    getFsService(){
        return this.fsService
    }

    setExecService(instance){
        this.execService = instance
    }

    getExecService(){
        return this.execService
    }

    getGithubToken(){
        return this.githubToken 
    }
    
    setGithubToken(githubToken){
        this.githubToken = githubToken
    }
    
    getFilePath(){
        return this.filePath 
    }
    
    setFilePath(filePath){
        this.filePath = filePath
    }

    setGithubService(instance){
        this.githubService = instance
    }

    getGithubService(){
        return this.githubService
    }

    setFormatService(instance){
        this.formatService = instance
    }

    getFormatService(){
        return this.formatService
    }

    async createChangelog(){
        const githubService = new GithubService(this.getGithubToken())
        githubService.setFormatService(this.getFormatService())
        githubService.setValidateService(this.getValidateService())
        this.getFormatService().setValidateService(this.getValidateService())
        this.setGithubService(githubService)

        if(!this.getGithubToken()){
            return
        }

       const parameters = {
            owner: github.context.payload.repository.owner.name,
            repo: github.context.payload.repository.name
        }
        
        githubService.setParam(parameters)
        const lastTag = await githubService.getLastTag(parameters)
        if(lastTag == null){
            return
        }

        const packageManager = this.getFsService().getPackageManager()
        githubService.setFsService(packageManager)
        
        const {content, sha} = await this.getFileRead(this.getFilePath())
        
        if(content == null){
            setFailed('Path inválido!')
            return
        }

        await this.getExecService().installDependencies(packageManager)
        this.getFsService().setExecService(this.getExecService())
        this.getFsService().setValidateService(this.getValidateService())
        const {fileBase64, path} = await this.getFsService().getModifyVersion(lastTag,this.getFilePath(), packageManager)
        await this.sendFile(fileBase64,'package.json', path, sha)
        
        await this.getExecService().generateChangelog(packageManager)
        const {changelogFileName, changelogBase64} = this.getFsService().getChangelogFile()
        const fileContentRead = await this.getFileRead(changelogFileName)
        await this.sendFile(changelogBase64, 'CHANGELOG.md' ,changelogFileName, fileContentRead.sha)

    }

    async sendFile(fileBase64, fileName, path, sha){
        const paramFormGithub = await this.getFormatService().prepareUploadGithub(fileBase64,fileName, path, sha)
        this.getGithubService().setParam(paramFormGithub)
        await this.getGithubService().uploadFileBase64()
    }

    async getFileRead(filePath){
        this.getFormatService().setParam(githubService.getParam())
        const {content, sha} = await this.getGithubService().getContent(filePath)
        return {content, sha}
    }
}