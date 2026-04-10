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





// pipeline {
//     agent any

//     options {
//         skipDefaultCheckout(true)
//     }

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
 
//         // 2️⃣ Deploy code to target server directory (KEEP media safe + INCLUDE tin)
//         stage('Deploy Code to Server Directory') {
//             steps {
//                 sh """
//                 echo "🚀 Deploying latest code to ${PROJECT_DIR}"

//                 # tin folder included
//                 # media folder is protected 
//                 sudo rsync -av --delete \
//                     --exclude '.git' \
//                     --exclude 'venv' \
//                     --exclude 'media' \
//                     ./ ${PROJECT_DIR}/

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
//                     sudo systemctl restart gunicorn_tata
//                     """
//                 }
//             }
//         }
 
//         // 8️⃣ Configure and reload Nginx
//         stage('Configure Nginx') {
//             steps {
//                 sh """
//                     echo "🔧 Testing Nginx configuration..."
//                     sudo nginx -t
                    
//                     echo "🔄 Restarting Nginx..."
//                     sudo systemctl restart nginx
                    
//                     echo "✅ Verifying services..."
//                     sudo systemctl status nginx --no-pager | head -10
//                     sudo systemctl status gunicorn_tata --no-pager | head -10 || echo "Gunicorn running in background"
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











// pipeline {
//     agent any

//     options {
//         skipDefaultCheckout(true)
//     }

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
 
//         // 2️⃣ Deploy Code to Server Directory (media safe)
//         stage('Deploy Code to Server Directory') {
//             steps {
//                 sh """
//                 echo "🚀 Deploying latest code to ${PROJECT_DIR}"

//                 sudo rsync -av --delete \
//                     --exclude '.git' \
//                     --exclude 'venv' \
//                     --exclude 'media' \
//                     ./ ${PROJECT_DIR}/

//                 sudo chown -R jenkins:jenkins ${PROJECT_DIR}
//                 sudo chmod -R 775 ${PROJECT_DIR}
//                 """
//             }
//         }
 
//         // 3️⃣ Ensure Node.js
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
 
//         // 4️⃣ Setup Python Environment
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
//                     echo "🧹 Cleaning old node_modules..."
//                     rm -rf node_modules
//                     rm -f package-lock.json

//                     echo "🔧 Fixing permissions..."
//                     sudo chown -R jenkins:jenkins .

//                     echo "📦 Installing dependencies..."
//                     npm install --legacy-peer-deps

//                     echo "🛠 Fixing AJV dependency mismatch..."
//                     npm install ajv@8.12.0 ajv-keywords@5.1.0 --save --legacy-peer-deps

//                     echo "🏗️ Building React app..."
//                     CI=false npm run build
//                     '''
//                 }
//             }
//         }
        
//         // 6️⃣ Collect Static Files
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
 
//         // 7️⃣ Restart Gunicorn
//         stage('Run Gunicorn') {
//             steps {
//                 dir("${DJANGO_DIR}") {
//                     sh """
//                     . venv/bin/activate
//                     echo "🔄 Restarting Gunicorn on port ${GUNICORN_PORT}"
//                     sudo systemctl restart gunicorn_tata
//                     """
//                 }
//             }
//         }

//         // 8️⃣ Fix Media Permissions (ADDED)
//         stage('Fix Media Permissions') {
//             steps {
//                 sh """
//                 echo "🔧 Fixing media permissions..."

//                 sudo chown -R adminscr:adminscr /var/www/html/Tata_Screening/media
//                 sudo chmod -R 775 /var/www/html/Tata_Screening/media
//                 sudo chmod -R a+rwx /var/www/html/Tata_Screening/media/media_files
//                 """
//             }
//         }
 
//         // 9️⃣ Configure Nginx
//         stage('Configure Nginx') {
//             steps {
//                 sh """
//                     echo "🔧 Testing Nginx configuration..."
//                     sudo nginx -t
                    
//                     echo "🔄 Restarting Nginx..."
//                     sudo systemctl restart nginx
                    
//                     echo "✅ Verifying services..."
//                     sudo systemctl status nginx --no-pager | head -10
//                     sudo systemctl status gunicorn_tata --no-pager | head -10 || echo "Gunicorn running in background"
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




pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
    }

    environment {
        PROJECT_DIR = "/var/www/html/Tata_Screening"
        DJANGO_DIR = "${PROJECT_DIR}/"
        REACT_DIR = "${PROJECT_DIR}/screening_client"
        PYTHON = "/usr/bin/python3"
        GUNICORN_PORT = "8000"
    }

    stages {

        // ✅ 1. Clean workspace
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        // ✅ 2. Checkout Code (no credentials needed if public repo)
        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [
                        [$class: 'CleanBeforeCheckout'],
                        [$class: 'PruneStaleBranch']
                    ],
                    userRemoteConfigs: [[
                        url: 'https://github.com/gitmaster-dms/Tata_Screening.git'
                    ]]
                ])
            }
        }

        // ✅ 3. Deploy Code
        stage('Deploy Code') {
            steps {
                sh '''
                #!/bin/bash
                set -euxo pipefail

                echo "🚀 Deploying code to ${PROJECT_DIR}"

                sudo mkdir -p ${PROJECT_DIR}

                sudo rsync -av --delete \
                    --exclude '.git' \
                    --exclude 'venv' \
                    --exclude 'media' \
                    ./ ${PROJECT_DIR}/

                sudo chown -R jenkins:jenkins ${PROJECT_DIR}
                sudo chmod -R 775 ${PROJECT_DIR}
                '''
            }
        }

        // ✅ 4. Ensure Node.js
        stage('Ensure Node.js') {
            steps {
                sh '''
                #!/bin/bash
                set -euxo pipefail

                if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
                    echo "⚙️ Installing Node.js 20..."
                    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                fi

                node -v
                npm -v
                '''
            }
        }

        // ✅ 5. Setup Python Environment
        stage('Setup Python') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh '''
                    #!/bin/bash
                    set -euxo pipefail

                    if [ ! -d "venv" ]; then
                        /usr/bin/python3 -m venv venv
                    fi

                    . venv/bin/activate
                    pip install --upgrade pip
                    pip install -r requirements.txt
                    pip install gunicorn
                    '''
                }
            }
        }

        // ✅ 6. Build React App
        stage('Build React') {
            steps {
                dir("${REACT_DIR}") {
                    sh '''
                    #!/bin/bash
                    set -euxo pipefail

                    echo "🧹 Cleaning old files..."
                    rm -rf node_modules package-lock.json

                    echo "🔧 Fix permissions..."
                    sudo chown -R jenkins:jenkins .

                    echo "📦 Installing dependencies..."
                    npm install --legacy-peer-deps

                    echo "🛠 Fix AJV issue..."
                    npm install ajv@8.12.0 ajv-keywords@5.1.0 --legacy-peer-deps

                    echo "🏗 Building React..."
                    CI=false npm run build
                    '''
                }
            }
        }

        // ✅ 7. Collect Static Files
        stage('Collect Static') {
            steps {
                dir("${DJANGO_DIR}") {
                    sh '''
                    #!/bin/bash
                    set -euxo pipefail

                    . venv/bin/activate
                    python manage.py collectstatic --noinput
                    '''
                }
            }
        }

        // ✅ 8. Restart Gunicorn
        stage('Restart Gunicorn') {
            steps {
                sh '''
                #!/bin/bash
                set -euxo pipefail

                echo "🔄 Restarting Gunicorn..."
                sudo systemctl restart gunicorn_tata
                sudo systemctl status gunicorn_tata --no-pager | head -10
                '''
            }
        }

        // ✅ 9. Fix Media Permissions
        stage('Fix Media Permissions') {
            steps {
                sh '''
                #!/bin/bash
                set -euxo pipefail

                echo "🔧 Fixing media permissions..."

                sudo chown -R adminscr:adminscr ${PROJECT_DIR}/media || true
                sudo chmod -R 775 ${PROJECT_DIR}/media || true
                '''
            }
        }

        // ✅ 10. Restart Nginx
        stage('Restart Nginx') {
            steps {
                sh '''
                #!/bin/bash
                set -euxo pipefail

                echo "🔧 Testing Nginx..."
                sudo nginx -t

                echo "🔄 Restarting Nginx..."
                sudo systemctl restart nginx

                sudo systemctl status nginx --no-pager | head -10
                '''
            }
        }
    }

    post {
        success {
            echo "✅ SUCCESS: Deployment completed successfully!"
        }
        failure {
            echo "❌ FAILURE: Check logs in Jenkins."
        }
    }
}