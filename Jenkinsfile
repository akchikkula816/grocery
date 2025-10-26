pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_ID') // Docker Hub Jenkins credential ID
        IMAGE_NAME = "akchikkula816/grocery-app"
        CONTAINER_NAME = "grocery-app-container"
        HOST_PORT = "8081"
        CONTAINER_PORT = "80"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/akchikkula816/grocery.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh """
                    echo "$DOCKER_HUB_CREDENTIALS_PSW" | docker login -u "$DOCKER_HUB_CREDENTIALS_USR" --password-stdin
                    docker push ${IMAGE_NAME}:latest
                    docker logout
                    """
                }
            }
        }

        stage('Deploy Container on EC2') {
            steps {
                script {
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME}:latest"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Docker image pushed and container deployed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
