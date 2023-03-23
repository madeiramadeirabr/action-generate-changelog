const githubMock = {
    githubProperties: githubProperties(),

}

function githubProperties(){
    return {
        github: {
            context: {
                payload:{
                    pull_request: {
                        title: 'teste',
                        head:{
                            repo:{
                                owner: 'teste'
                            }
                        }
                    },
                    repository: {
                        name:'teste',
                        owner:{
                            login: 'teste'
                        }
                    },
                    sender: {
                        login: 'teste'
                    }, 
                    number: 34
                }
            }
        }
    }
} 
export default githubMock