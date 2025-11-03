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
        // 1️⃣ Pull latest code into Jenkins workspace
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/gitmaster-dms/Tata_Screening.git'
            }
        }

        // 2️⃣ Deploy code to /var/www/html/Tata_Screening
        stage('Deploy Code to Server Directory') {
            steps {
                sh """
                # Clean deploy directory and copy new files
                rm -rf ${PROJECT_DIR}
                mkdir -p ${PROJECT_DIR}
                cp -r * ${PROJECT_DIR}/

                # Fix permissions so Jenkins + Nginx can access
                chown -R jenkins:www-data ${PROJECT_DIR}
                chmod -R 775 ${PROJECT_DIR}
                """
            }
        }

        // 3️⃣ Setup Python virtual environment and install deps
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

        // 4️⃣ Build React frontend
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

        // 6️⃣ Restart Gunicorn
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

        // 7️⃣ Configure and reload Nginx
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
