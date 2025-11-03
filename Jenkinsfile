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
        stage('Pull Latest Code') {
            steps {
                dir("${PROJECT_DIR}") {
                    sh """
                    git fetch origin main
                    git reset --hard origin/main
                    """
                }
            }
        }

        stage('Setup Python Environment') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh """
                    if [ ! -d "venv" ]; then
                        ${PYTHON} -m venv venv
                    fi
                    . venv/bin/activate
                    ${PIP} install --upgrade pip
                    ${PIP} install -r requirements.txt
                    """
                }
            }
        }

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

        stage('Run Gunicorn') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh """
                    . venv/bin/activate
                    pkill gunicorn || true
                    nohup gunicorn Tata_Screening.wsgi:application --bind 0.0.0.0:${GUNICORN_PORT} --daemon
                    """
                }
            }
        }

        stage('Configure Nginx') {
            steps {
                sh """
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
            echo "✅ Deployment complete! Django + React app is running from /var/www/html/Tata_Screening."
        }
        failure {
            echo "❌ Deployment failed — check Jenkins logs."
        }
    }
}
