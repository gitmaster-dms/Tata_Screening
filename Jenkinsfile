// pipeline {
//     agent any

//     environment {
//         PROJECT_DIR = "/var/www/html/Tata_Screening"
//         DJANGO_DIR = "${PROJECT_DIR}/"
//         REACT_DIR = "${PROJECT_DIR}/screening_client"
//         PYTHON = "/usr/bin/python3"
//         PIP = "/usr/bin/pip3"
//         GUNICORN_PORT = "8000"
//     }

//     stages {

//         // 1️⃣ Checkout latest code
//         stage('Checkout Code') {
//             steps {
//                 git branch: 'main', url: 'https://github.com/gitmaster-dms/Tata_Screening.git'
//             }
//         }

//         // 2️⃣ Deploy code to target server directory
//         stage('Deploy Code to Server Directory') {
//             steps {
//                 sh """
//                 set -euxo pipefail
//                 echo "🚀 Deploying latest code to ${PROJECT_DIR}"
//                 sudo rm -rf ${PROJECT_DIR}
//                 sudo mkdir -p ${PROJECT_DIR}
//                 sudo cp -r * ${PROJECT_DIR}/
//                 sudo chown -R jenkins:jenkins ${PROJECT_DIR}
//                 sudo chmod -R 775 ${PROJECT_DIR}
//                 """
//             }
//         }

//         // 3️⃣ Ensure Node.js (v20) and npm are installed
//         stage('Ensure Node.js') {
//             steps {
//                 sh '''
//                 set -euxo pipefail
//                 if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
//                     echo "⚙️ Installing Node.js 20..."
//                     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
//                     sudo apt install -y nodejs
//                 fi
//                 echo "Node version: $(node -v)"
//                 echo "NPM version: $(npm -v)"
//                 '''
//             }
//         }

//         // 4️⃣ Setup Python virtual environment
//         stage('Setup Python Environment') {
//             steps {
//                 dir("${DJANGO_DIR}") {
//                     sh """
//                     set -euxo pipefail
//                     if [ ! -d "venv" ]; then
//                         ${PYTHON} -m venv venv
//                     fi
//                     . venv/bin/activate
//                     pip install --upgrade pip
//                     pip install -r requirements.txt
//                     pip install gunicorn
//                     """
//                 }
//             }
//         }

//         // 5️⃣ Build React App
//         stage('Build React App') {
//             steps {
//                 dir("${REACT_DIR}") {
//                     sh '''
//                     set -euxo pipefail
//                     echo "⚙️ Setting permissions..."
//                     sudo chown -R $USER:$USER ${REACT_DIR}
//                     sudo chmod -R 775 ${REACT_DIR}

//                     echo "📦 Installing npm dependencies..."
//                     npm install --legacy-peer-deps

//                     echo "🏗️ Building React app..."
//                     CI=false npm run build
//                     '''
//                 }
//             }
//         }

//         // 6️⃣ Collect Django static files
//         stage('Collect Static Files') {
//             steps {
//                 dir("${DJANGO_DIR}") {
//                     sh """
//                     set -euxo pipefail
//                     . venv/bin/activate
//                     python manage.py collectstatic --noinput
//                     """
//                 }
//             }
//         }

//         // 7️⃣ Restart Gunicorn process
//         stage('Run Gunicorn') {
//             steps {
//                 dir("${DJANGO_DIR}") {
//                     sh """
//                     set -euxo pipefail
//                     . venv/bin/activate
//                     echo "🔄 Restarting Gunicorn on port ${GUNICORN_PORT}"
//                     pkill gunicorn || true
//                     nohup gunicorn Tata_Screening.wsgi:application --bind 0.0.0.0:${GUNICORN_PORT} --daemon
//                     """
//                 }
//             }
//         }

//         // 8️⃣ Configure and reload Nginx
//         stage('Configure Nginx') {
//             steps {
//                 sh """
//                 set -euxo pipefail
//                 sudo nginx -t
//                 sudo systemctl restart gunicorn_tata
//                 sudo systemctl restart nginx
//                 """
//             }
//         }
//     }

//     post {
//         success {
//             echo "✅ Deployment complete! Django + React app running from ${PROJECT_DIR}"
//         }
//         failure {
//             echo "❌ Deployment failed — check Jenkins logs."
//         }
//     }
// }

// #################################################################################################################



// pipeline {
//     agent any
 
//     environment {
//         PROJECT_DIR = "/var/www/html/Tata_Screening"
//         DJANGO_DIR = "${PROJECT_DIR}/"
//         REACT_DIR = "${PROJECT_DIR}/screening_client"
//         PYTHON = "/usr/bin/python3"
//         PIP = "/usr/bin/pip3"
//         GUNICORN_PORT = "8000"
//     }
 
//     stages {
 
//         // 1️⃣ Checkout latest code
//         stage('Checkout Code') {
//             steps {
//                 git branch: 'main', url: 'https://github.com/gitmaster-dms/Tata_Screening.git'
//             }
//         }
 
//         // 2️⃣ Deploy code to target server directory
//         stage('Deploy Code to Server Directory') {
//             steps {
//                 sh """
//                 echo "🚀 Deploying latest code to ${PROJECT_DIR}"
//                 sudo rm -rf ${PROJECT_DIR}
//                 sudo mkdir -p ${PROJECT_DIR}
//                 sudo cp -r * ${PROJECT_DIR}/
//                 sudo chown -R jenkins:jenkins ${PROJECT_DIR}
//                 sudo chmod -R 775 ${PROJECT_DIR}
//                 """
//             }
//         }
 
//         // 3️⃣ Ensure Node.js (v20) and npm are installed
//         stage('Ensure Node.js') {
//             steps {
//                 sh '''
//                 if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
//                     echo "⚙️ Installing Node.js 20..."
//                     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
//                     sudo apt install -y nodejs
//                 fi
//                 echo "Node version: $(node -v)"
//                 echo "NPM version: $(npm -v)"
//                 '''
//             }
//         }
 
//         // 4️⃣ Setup Python virtual environment
//         stage('Setup Python Environment') {
//             steps {
//                 dir("${DJANGO_DIR}") {
//                     sh """
//                     if [ ! -d "venv" ]; then
//                         ${PYTHON} -m venv venv
//                     fi
//                     . venv/bin/activate
//                     pip install --upgrade pip
//                     pip install -r requirements.txt
//                     pip install gunicorn
//                     """
//                 }
//             }
//         }
 
//         // 5️⃣ Build React App
//         stage('Build React App') {
//             steps {
//                 dir("${REACT_DIR}") {
//                     sh '''
//                     echo "⚙️ Setting permissions..."
//                     sudo chown -R $USER:$USER ${REACT_DIR}
//                     sudo chmod -R 775 ${REACT_DIR}
 
//                     echo "📦 Installing npm dependencies..."
//                     npm install --legacy-peer-deps
 
//                     echo "🏗️ Building React app..."
//                     CI=false npm run build
//                     '''
//                 }
//             }
//         }
 
//         // 6️⃣ Collect Django static files
//         stage('Collect Static Files') {
//             steps {
//                 dir("${DJANGO_DIR}") {
//                     sh """
//                     . venv/bin/activate
//                     python manage.py collectstatic --noinput
//                     """
//                 }
//             }
//         }
 
//         // 7️⃣ Restart Gunicorn process
//         stage('Run Gunicorn') {
//             steps {
//                 dir("${DJANGO_DIR}") {
//                     sh """
//                     . venv/bin/activate
//                     echo "🔄 Restarting Gunicorn on port ${GUNICORN_PORT}"
//                     pkill gunicorn || true
//                     nohup gunicorn Tata_Screening.wsgi:application --bind 0.0.0.0:${GUNICORN_PORT} --daemon
//                     """
//                 }
//             }
//         }
 
//         // 8️⃣ Configure and reload Nginx
//         stage('Configure Nginx') {
//             steps {
//                 sh """
//                     sudo nginx -t
//                     sudo systemctl restart gunicorn_tata
//                     sudo systemctl restart nginx
                   
//                 """
//             }
//         }
//     }
 
//     post {
//         success {
//             echo "✅ Deployment complete! Django + React app running from ${PROJECT_DIR}"
//         }
//         failure {
//             echo "❌ Deployment failed — check Jenkins logs."
//         }
//     }
// }

// #################################################################################################################

pipeline {
    agent any

    environment {
        PROJECT_DIR = "/var/www/html/Tata_Screening"        // Live production directory
        BUILD_DIR = "/tmp/Tata_Screening_build"             // Temporary build directory
        DJANGO_DIR = "${BUILD_DIR}/"
        REACT_DIR = "${BUILD_DIR}/screening_client"
        PYTHON = "/usr/bin/python3"
        PIP = "/usr/bin/pip3"
        GUNICORN_PORT = "8000"
    }

    stages {

        // 1️⃣ Checkout latest code
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/gitmaster-dms/Tata_Screening.git'
            }
        }

        // 2️⃣ Deploy code to temporary build directory
        stage('Prepare Build Directory') {
            steps {
                sh """
                set -euxo pipefail
                echo "🚀 Preparing temporary build directory at ${BUILD_DIR}"
                sudo rm -rf ${BUILD_DIR}
                sudo mkdir -p ${BUILD_DIR}
                sudo cp -r * ${BUILD_DIR}/
                sudo chown -R jenkins:jenkins ${BUILD_DIR}
                sudo chmod -R 775 ${BUILD_DIR}
                """
            }
        }

        // 3️⃣ Ensure Node.js (v20) and npm are installed
        stage('Ensure Node.js') {
            steps {
                sh '''
                set -euxo pipefail
                if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
                    echo "⚙️ Installing Node.js 20..."
                    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                    sudo apt install -y nodejs
                fi
                echo "Node version: $(node -v)"
                echo "NPM version: $(npm -v)"
                '''
            }
        }

        // 4️⃣ Setup Python virtual environment
        stage('Setup Python Environment') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh """
                    set -euxo pipefail
                    if [ ! -d "venv" ]; then
                        ${PYTHON} -m venv venv
                    fi
                    . venv/bin/activate
                    pip install --upgrade pip
                    pip install -r requirements.txt
                    pip install gunicorn
                    """
                }
            }
        }

        // 5️⃣ Build React App
        stage('Build React App') {
            steps {
                dir("${REACT_DIR}") {
                    sh '''
                    set -euxo pipefail
                    echo "⚙️ Setting permissions..."
                    sudo chown -R $USER:$USER ${REACT_DIR}
                    sudo chmod -R 775 ${REACT_DIR}

                    echo "📦 Installing npm dependencies..."
                    npm install --legacy-peer-deps

                    echo "🏗️ Building React app..."
                    CI=false npm run build
                    '''
                }
            }
        }

        // 6️⃣ Collect Django static files
        stage('Collect Static Files') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh """
                    set -euxo pipefail
                    . venv/bin/activate
                    python manage.py collectstatic --noinput
                    """
                }
            }
        }

        // 7️⃣ Promote build to production directory (only if all previous stages succeed)
        stage('Promote Build to Production') {
            when { success() }
            steps {
                sh """
                set -euxo pipefail
                echo "✅ Promoting new build to production at ${PROJECT_DIR}"
                sudo rm -rf ${PROJECT_DIR}
                sudo mv ${BUILD_DIR} ${PROJECT_DIR}
                sudo chown -R jenkins:jenkins ${PROJECT_DIR}
                sudo chmod -R 775 ${PROJECT_DIR}
                """
            }
        }

        // 8️⃣ Restart Gunicorn
        stage('Run Gunicorn') {
            when { success() }
            steps {
                dir("${PROJECT_DIR}") {
                    sh """
                    set -euxo pipefail
                    . venv/bin/activate
                    echo "🔄 Restarting Gunicorn on port ${GUNICORN_PORT}"
                    pkill gunicorn || true
                    nohup gunicorn Tata_Screening.wsgi:application --bind 0.0.0.0:${GUNICORN_PORT} --daemon
                    """
                }
            }
        }

        // 9️⃣ Configure and reload Nginx
        stage('Configure Nginx') {
            when { success() }
            steps {
                sh """
                set -euxo pipefail
                sudo nginx -t
                sudo systemctl restart gunicorn_tata
                sudo systemctl restart nginx
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment complete! New version running from ${PROJECT_DIR}"
        }
        failure {
            echo "❌ Build failed — previous version remains live and unaffected."
        }
    }
}
