pipeline {
    agent any

    environment {
        PROJECT_DIR = "/var/www/html/Tata_Screening"
        DJANGO_DIR = "${PROJECT_DIR}/backend"
        REACT_DIR = "${PROJECT_DIR}/frontend"
        PYTHON = "/usr/bin/python3"
        PIP = "/usr/bin/pip3"
        GUNICORN_PORT = "8000"
    }

    stages {

        // 1️⃣ Checkout code into Jenkins workspace
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/gitmaster-dms/Tata_Screening.git'
            }
        }

        // 2️⃣ Deploy files to web directory
        stage('Deploy Code to Server Directory') {
            steps {
                sh """
                echo "🚀 Deploying latest code to ${PROJECT_DIR}"
                sudo rm -rf ${PROJECT_DIR}
                sudo mkdir -p ${PROJECT_DIR}
                sudo cp -r * ${PROJECT_DIR}/
                sudo chown -R jenkins:www-data ${PROJECT_DIR}
                sudo chmod -R 775 ${PROJECT_DIR}
                """
            }
        }

        // 3️⃣ Python virtual environment setup
        stage('Setup Python Environment') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh """
                    if [ ! -d "venv" ]; then
                        ${PYTHON} -m venv venv
                    fi
                    . venv/bin/activate
                    pip install --upgrade pip
                    pip install -r requirements.txt
                    """
                }
            }
        }

        // 4️⃣ React app build
        stage('Build React App') {
            steps {
                dir("${REACT_DIR}") {
                    sh """
                    npm install
                    npm run build
                    """
                }
            }
        }

        // 5️⃣ Collect Django static files
        stage('Collect Static Files') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh """
                    . venv/bin/activate
                    python manage.py collectstatic --noinput
                    """
                }
            }
        }

        // 6️⃣ Restart Gunicorn process
        stage('Run Gunicorn') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh """
                    . venv/bin/activate
                    echo "🔄 Restarting Gunicorn on port ${GUNICORN_PORT}"
                    pkill gunicorn || true
                    nohup gunicorn Tata_Screening.wsgi:application --bind 0.0.0.0:${GUNICORN_PORT} --daemon
                    """
                }
            }
        }

        // 7️⃣ Configure and reload Nginx
        stage('Configure Nginx') {
            steps {
                sh """
                echo "⚙️ Configuring Nginx..."
                sudo cp ${DJANGO_DIR}/deploy/nginx.conf /etc/nginx/sites-available/Tata_Screening
                sudo ln -sf /etc/nginx/sites-available/Tata_Screening /etc/nginx/sites-enabled/
                sudo nginx -t
                sudo systemctl reload nginx
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment complete! Django + React app running from ${PROJECT_DIR}"
        }
        failure {
            echo "❌ Deployment failed — check Jenkins logs."
        }
    }
}
