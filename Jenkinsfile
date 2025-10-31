pipeline {
    agent any   // Run on any available Jenkins node

    stages {
        stage('Build') {
            steps {
                echo '🏗️  Starting the Build stage...'
                echo '✅ Build completed successfully!'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running some fake tests...'
                echo '✅ All tests passed!'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application (demo only)...'
                echo '✅ Deployment simulation complete!'
            }
        }
    }

    post {
        always {
            echo '📦 Pipeline finished (success or failure).'
        }
        success {
            echo '🎉 Pipeline finished successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
