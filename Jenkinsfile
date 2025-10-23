pipeline {
  agent any

  environment {
    HEROKU_API_KEY = credentials('HEROKU_ID') // Jenkins credential ID for your Heroku API key
    HEROKU_EMAIL = 'anilkumarchikkula2000@gmail.com'
    HEROKU_APP_NAME = 'grocery-app-2025'
  }

  stages {
    stage('Clean Workspace') {
      steps {
        deleteDir() // Clears workspace to avoid permission issues
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

    stage('Deploy to Heroku') {
      steps {
        sh '''
          echo "machine api.heroku.com login $HEROKU_EMAIL password $HEROKU_API_KEY" > ~/.netrc
          echo "machine git.heroku.com login $HEROKU_EMAIL password $HEROKU_API_KEY" >> ~/.netrc
          chmod 600 ~/.netrc
          git remote add heroku https://git.heroku.com/$HEROKU_APP_NAME.git || true
          git push heroku main --force
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Deployment to Heroku successful!'
    }
    failure {
      echo '❌ Deployment failed. Check logs for details.'
    }
  }
}

