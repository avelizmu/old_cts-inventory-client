pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
    containers:
    - name: node
      image: node:14
      tty: true
    - name: docker
      image: docker:latest
      securityContext:
        privileged: true
      volumeMounts:
      - mountPath: /var/run/docker.sock
        name: docker-socket-volume
      tty: true
    volumes:
      - name: docker-socket-volume
        hostPath:
          path: /var/run/docker.sock
          type: File
"""
        }
    }
    stages {
        stage('Test') {
            steps {
                container('node') {
                    sh 'npm ci'
                    sh 'npm test'
                }
            }
        }
        stage('Publish') {
            steps {
                container('docker') {
                    script {
                        docker.withRegistry('https://registry.veliz99.com', 'veliz99-registry-credentials') {
                            def image = docker.build("cts-inventory-client:${BRANCH_NAME}-${BUILD_NUMBER}")
                            image.push()
                            image.push('latest')
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.18.5/bin/linux/amd64/kubectl'

                sh 'chmod +x ./kubectl'
                withKubeConfig([credentialsId: 'kubernetes-service-account']) {
                    script {
                        sh './kubectl set image deployment cts-inventory-${BRANCH_NAME}-client registry.veliz99.com/cts-inventory-client:${BRANCH_NAME}-${BUILD_NUMBER} -n cts-inventory || sed "s/REPLACEME_NAME/cts-inventory-${BRANCH_NAME}-client/g; s/REPLACEME_IMAGE/registry.veliz99.com\\/cts-inventory-client:${BRANCH_NAME}-${BUILD_NUMBER}/g" ./jenkins/deployment.yaml | ./kubectl apply -f -'

                        // Expose the server deployment for this branch if it isn't already
                        sh './kubectl get Service cts-inventory-${BRANCH_NAME}-client -n cts-inventory || ./kubectl expose deployment cts-inventory-${BRANCH_NAME}-client -n cts-inventory'
                        // Expose an ingress for this branch if it doesn't have on already
                        sh './kubectl get ingress cts-inventory-${BRANCH_NAME}-client -n cts-inventory || sed "s/REPLACEME_NAME/cts-inventory-${BRANCH_NAME}-client/g; s/REPLACEME_HOST/${BRANCH_NAME}.cts-inventory.${DOMAIN}/g; s/REPLACEME_SERVICE/cts-inventory-${BRANCH_NAME}-client/g" ./jenkins/ingress.yaml | ./kubectl apply -f -'
                    }
                }
            }
        }
    }
}