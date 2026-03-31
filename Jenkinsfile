
pipeline {
    agent any
    
    stages {
        
        stage('Install') {
            steps {
                sh 'bun install'
            }
        }
        stage('Build') {
            steps {
                sh 'bun run build'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    scp -r dist/* $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
                '''
            }
        }

    }
}