import axios from 'axios'
import { setFailed, setOutput } from '@actions/core'
import {Octokit} from '@octokit/core'

export default class GithubService{
    constructor(githubToken){
        this.setGithubToken(githubToken)
        this.setOctokit(new Octokit({ auth: githubToken}))
    }

    getOctokit(){
        return this.octokit
    }

    setOctokit(octokit){
        this.octokit = octokit
    }

    getParam(){
        return this.param
    }
    
    setParam(param){
        this.param = param
    }

    getGithubToken(){
        return this.githubToken
    }

    setGithubToken(githubToken){
        this.githubToken = githubToken
    }

    setValidateService(instance){
        this.validate = instance
    }
    
    getValidateService(){
        return this.validate
    }
    
    setFsService(instace){
        this.fsService = instace
    }
    
    getFsService(){
        return this.fsService
    }

    setFormatService(instance){
        this.formatService = instance
    }

    getFormatService(){
        return this.formatService
    }

    async getLastTag(param){
        
        if(!this.getValidateService().payloadIsValid()){
            return null
        }
        
        try{
            const response =  await this.getOctokit().request('GET /repos/{owner}/{repo}/git/refs/tags', param)
            let lastTag = null
            if(this.getValidateService().statusSuccess(response.status)){
                lastTag = response.data.pop().ref.split('/').pop()
                console.log('A tag encontrada é', lastTag)
            }

            if(!this.getValidateService().validateTag(lastTag)){
                setFailed(`A tag ${lastTag} não é uma tag válida!`)
            }
            return lastTag
        }catch(error){
            setFailed(`Não existe tag neste repositório!`)
            return null
        }
    }

    async getContent(path){
        try{
            if(path != 'CHANGELOG.md'){
               path  = this.getFormatService().pathPackageJsonConfigure(path)
            }
            
            this.getParam().path = path
            const response = await this.getOctokit().request('GET /repos/{owner}/{repo}/contents/{path}', this.getParam())
            
            if (this.getValidateService().statusSuccess(response.status)){
                delete this.getParam().path
                const {content, sha} = response.data
                
                return {
                    content: content,
                    sha: sha
                }
            }

            if(path.toLowerCase().includes('package.json')){
                this.getValidateService().statusError(response.status)
            }
            
            return {
                content: null,
                sha: null
            }

        }catch(error){
            delete this.getParam().path
            return {
                content: null,
                sha: null
            } 
        }
    }

    async  getContentFile (raw_url){
        try{
            return await axios.get(raw_url, {
                headers: {
                    Authorization: `Bearer ${this.getGithubToken()}`
                }
            })
        }catch(error){
            setFailed('Erro ao carregar o conteúdo do arquivo!')
        }
    }

    async uploadFileBase64(){
        try{
            const response = await this.getOctokit().request('PUT /repos/{owner}/{repo}/contents/{path}', this.getParam())
            if(this.getValidateService().statusSuccess(response.status)){
                console.log(this.getParam().message)

                delete this.getParam().path
                delete this.getParam().message
                delete this.getParam().content
                delete this.getParam().sha
                setOutput("success", this.getParam().message)
            } 
        }catch(error){
            setFailed("Erro ao salvar arquivo: ",error)
        }
    }
    
}