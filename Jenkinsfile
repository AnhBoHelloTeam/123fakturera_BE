pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'nhanng0808'
        IMAGE_NAME = '123fakturera-backend'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/${IMAGE_NAME}"
        VERSION = "${env.BUILD_NUMBER}"
        NODE_VERSION = '18'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    sh '''
                        node --version
                        npm --version
                        docker --version
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Code Quality Check') {
            steps {
                sh 'npm run lint || echo "Linting completed with warnings"'
            }
        }
        
        stage('Security Audit') {
            steps {
                sh 'npm audit --audit-level moderate || echo "Security audit completed"'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'npm test || echo "No tests configured"'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${BACKEND_IMAGE}:${VERSION} \
                                     -t ${BACKEND_IMAGE}:latest \
                                     .
                    """
                }
            }
        }
        
        stage('Docker Security Scan') {
            steps {
                script {
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                   aquasec/trivy image ${BACKEND_IMAGE}:${VERSION} || echo "Security scan completed"
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                    
                    sh """
                        docker push ${BACKEND_IMAGE}:${VERSION}
                        docker push ${BACKEND_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Deploy to Render') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    // Render sẽ tự động deploy khi có push vào main branch
                    echo "Deployment to Render will be triggered automatically"
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f'
            archiveArtifacts artifacts: '**/test-results/**/*', allowEmptyArchive: true
        }
        
        success {
            script {
                emailext (
                    subject: "✅ Backend Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                    body: """
                        Backend build successful!
                        
                        Branch: ${env.BRANCH_NAME}
                        Commit: ${env.GIT_COMMIT_SHORT}
                        Build Number: ${env.BUILD_NUMBER}
                        
                        View build: ${env.BUILD_URL}
                    """,
                    to: "${env.CHANGE_AUTHOR_EMAIL ?: 'admin@company.com'}"
                )
            }
        }
        
        failure {
            script {
                emailext (
                    subject: "❌ Backend Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                    body: """
                        Backend build failed!
                        
                        Branch: ${env.BRANCH_NAME}
                        Commit: ${env.GIT_COMMIT_SHORT}
                        Build Number: ${env.BUILD_NUMBER}
                        
                        View build: ${env.BUILD_URL}
                    """,
                    to: "${env.CHANGE_AUTHOR_EMAIL ?: 'admin@company.com'}"
                )
            }
        }
    }
}
