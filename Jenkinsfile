pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS = '0'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh '''
                    npm ci
                '''
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                sh '''
                    npx playwright install --with-deps chromium firefox webkit
                '''
            }
        }

        stage('Start Dev Server') {
            steps {
                echo 'Starting development server...'
                sh '''
                    npm run dev &
                    sleep 10
                    curl -s http://localhost:3000 > /dev/null || exit 1
                '''
            }
        }

        stage('Run API Tests') {
            steps {
                echo 'Running API tests...'
                sh '''
                    npx playwright test tests/api/ --reporter=list || true
                '''
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Running E2E tests...'
                sh '''
                    npx playwright test tests/blog-complete.spec.ts --reporter=list || true
                '''
            }
        }

        stage('Generate Test Report') {
            steps {
                echo 'Generating test report...'
                sh '''
                    if [ -d "playwright-report" ]; then
                        echo "Playwright report available at: playwright-report/index.html"
                    fi
                '''
                publishHTML target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report'
                ]
            }
        }

        stage('Stop Dev Server') {
            steps {
                echo 'Stopping development server...'
                sh '''
                    pkill -f "next dev" || true
                '''
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            sh '''
                rm -rf test-results/ playwright-report/ 2>/dev/null || true
            '''
            cleanWs()
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the test report for details.'
        }
    }
}
