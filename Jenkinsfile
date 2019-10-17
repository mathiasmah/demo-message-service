pipeline {
    agent any
    tools {nodejs "nodejs"}
    triggers { pollSCM('H/15 * * * *') }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run compile'
            }
        }
        stage('Package') {
            steps {
                dir('build') {
                    sh 'cp -r ../lib ../node_modules ../manifest.yaml .'
                    unik build(base: 'rump', imageName: 'message-service-rump', language: 'nodejs', provider: 'virtualbox', unikFolder: "${WORKSPACE}/build", force: true )
                    deleteDir()
                }
            }
        }
        stage('Release') {
            steps {
                unik push(imageName: 'messages-service-rump', unikHubEndpoint: hub(credentialsId: 'unik-hub'))
            }
        }
        stage('Deploy') {
            input {
                message "Should release be deployed?"
                ok "Yes"
                parameters {
                    string(name: 'INSTANCES', defaultValue: '1', description: 'How many instances?')
                }
            }
            steps {
                script{
                    for(i = 0; i < ${params.instances}; i++) {
                        unik run(imageName: 'message-service-rump', instanceName: 'message-service', envs: "STORAGE_ADDRESS=$STORAGE_ADDRESS LOAD_BALANCER=$LOAD_BALANCER PORT=700${i}")
                    }
                }       
            }
        }
    }
}