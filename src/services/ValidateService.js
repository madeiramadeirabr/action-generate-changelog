import { setFailed } from '@actions/core';
import * as github from '@actions/github'

export default class ValidateService {
    constructor (){
        this.setGithub(github)
    }

    setGithub(github){
        this.github = github
    }
    
    getGithub(){
        return this.github
    }

    statusSuccess(statusCode){        
        const aceptedStatus = [200,201,204,302]
        
        if(aceptedStatus.indexOf(statusCode) > -1){
            return true
        }
        return false
    }

    statusError(statusCode){        
        if (statusCode == 403){
            setFailed('Status 403 Você não tem permissão para acessar esse recurso!')
            return false
        }
        
        if (statusCode == 404){
            setFailed('Status 404 Não foi possível localizar o arquivo ou o repositório!')
            return false
        }

        return true
    }

    validateTag(tag){
    
        const defaulTag = tag.match('([v0-9|0-9]+).([0-9]+).([0-9]+)')
        if(defaulTag){
            return tag
        }
        
        return false
    }

    isPathPackageJsonIsNotEmpty(path){
        
        if(!path){
            return false
        }

        if(!path != ''){
            return false
        }

        if(!path.split('/').pop() == ''){
            return false
        }

        return true
    }
    
    isPathPackageJsonCompoundIsNotEmpty(path){
        if(!path){
            return false
        }

        if(!path != ''){
            return false
        }

        if(path.split('/').pop() == ''){
            return false
        }

        return true
    }

    isPathPackageJsonIsEmpty(path){
        if(!path){
            return false
        }

        if(path != ''){
            return false
        }

        return true
    }

    haveCredential(githubToken){
        if(!githubToken){
            setFailed('O github-token é um parâmetro obrigatório!')
            return false
        }

        return true
    }
    
    payloadIsValid(){
        
        if (!Object.hasOwnProperty.bind(this.getGithub())('context')){
            setFailed('A propriedade `context` não foi encontrada!')
            return false
        }
    
        if (!Object.hasOwnProperty.bind(this.getGithub().context)('payload')){
            setFailed('A propriedade `payload` não foi encontrada!')
            return false
        }
        
        if (!Object.hasOwnProperty.bind(this.getGithub().context.payload)('repository')){
            setFailed('A propriedade `repository` não foi encontrada!')
            return false
        }
        
        if (!Object.hasOwnProperty.bind(this.getGithub().context.payload.repository)('name')){
            setFailed('A propriedade `name` não foi encontrada!')
            return false
        }
        
        if (!Object.hasOwnProperty.bind(this.getGithub().context.payload.repository)('owner')){
            setFailed('A propriedade `owner` não foi encontrada!')
            return false
        }
        
        if (!Object.hasOwnProperty.bind(this.getGithub().context.payload.repository)('name')){
            setFailed('A propriedade `name` não foi encontrada!')
            return false
        }
        return true
    }
    
}