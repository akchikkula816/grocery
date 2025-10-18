pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'node', url: 'https://github.com/akchikkula816/grocery.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build script, skipping..."'
            }
        }

        stage('Start Server') {
            steps {
                sh 'node server.js &'
            }
        }
    }
}
