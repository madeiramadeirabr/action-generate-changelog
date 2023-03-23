import ValidateService from "../src/services/ValidateService.js"
import githubMock from "../mock/githubMock.js"
test('Validates if github object has all required properties', ()=>{
   const {githubProperties } = githubMock
   const validateService = new ValidateService(githubProperties.github) 
  
  expect(validateService.payloadIsValid()).toBe(true)
})
test('Check if the status code is success', ()=>{
   const {githubProperties } = githubMock
   const validateService = new ValidateService(githubProperties.github)
   expect(validateService.statusSuccess(200)).toBe(true)
})

test('Check if the status code is 403 or 404', ()=>{
   const {githubProperties } = githubMock
   const validateService = new ValidateService(githubProperties.github)
   expect(validateService.statusError(403)).toBe(false)
})

test('Check if the tag is within the pattern', ()=>{
   const {githubProperties } = githubMock
   const validateService = new ValidateService(githubProperties.github)
   expect(validateService.validateTag("1.0.0")).toBe("1.0.0")
})

test('Make sure package.json is not empty', ()=>{
   const {githubProperties } = githubMock
   const validateService = new ValidateService(githubProperties.github)
   expect(validateService.isPathPackageJsonIsNotEmpty("/")).toBe(true)
})

test('Make sure the composite package.json path is not empty', ()=>{
   const {githubProperties } = githubMock
   const validateService = new ValidateService(githubProperties.github)
   expect(validateService.isPathPackageJsonCompoundIsNotEmpty("/src/package.json")).toBe(true)
})

test('Check if package.json path is empty', ()=>{
   const {githubProperties } = githubMock
   const validateService = new ValidateService(githubProperties.github)
   expect(validateService.isPathPackageJsonIsEmpty("/src")).toBe(true)
})