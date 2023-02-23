export default class FormatService {
    
    setValidateService(instance){
        this.validateService = instance
    }
    
    getValidateService(){
       return this.validateService
    }

    getParam(){
        return this.param
    }
    
    setParam(param){
        this.param = param
    }
    
    async  prepareUploadGithub(content, fileName, path ,sha){
        if(path.split('.')[0] == ''){
           path = path.substr(1)
        }

        if(path.substr(0, 1) == '/'){
            path = path.substr(1)
        }        
        
        this.getParam().path = fileName != 'CHANGELOG.md'? path : fileName
        this.getParam().message = sha == null ? `ci: Create ${fileName}` : `ci: Update ${fileName}`
        this.getParam().content = content
        if(sha != null){
            this.getParam().sha = sha
        }

        return this.getParam()
    }

    pathPackageJsonConfigure(path){
        if(this.getValidateService().isPathPackageJsonIsNotEmpty(path)){
            path = path.slice(0, -1)
            path += '/package.json' 
            return path
        }
        
        if(this.getValidateService().isPathPackageJsonCompoundIsNotEmpty(path)){
            return `${path}/package.json`
        }
        
        return 'package.json'
    }

    base64Encode(content){
        return new Buffer.from(content).toString('base64')
    }    
    
    base64Decode(content){
        return new Buffer.from(content, 'base64').toString('utf8')
    }    
}