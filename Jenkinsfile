pipeline {
    environment {
    registry = "ctruh.azurecr.io/backend/jioconvention-service"
    containername = "jioconvention-service"
    http_port = "5002"
    registryCredential = 'acrid'
    dockerImage = ''
    }

    agent { label params.Environment }
    stages {
            stage('Cloning our Git') {
                steps {
                git branch: params.branch, url: 'git@github.com:Ctruhtech/ctruh_jio_convection_service.git'
                }
            }
             stage('set Environment File') {
                steps {
                    script {
                    writeFile file: 'envfile', text: "${params.EnvVariables}"
                    writeFile file: './env', text: "${params.EnvVariables}"
                    }
                }
            }
            stage('Building Docker Image') {
                steps {
                    script {
                        sh "whoami"
                        dockerImage = docker.build(registry+":v1.$BUILD_NUMBER", "-f Dockerfile .")
                    }
                }
            }

            stage('upload Docker Image to Azure Container Registry') {
                steps {
                    script {
                        docker.withRegistry('https://ctruh.azurecr.io', registryCredential) {
                        dockerImage.push()
                        }
                    }
                }
            }
            stage ('Image Prune') { 
                steps {
                        imagePrune(containername)
                        echo "Image prune is complete"
                }
            }
            stage('Deploy Container') {
                    steps {
                        runApp(containername, http_port)
                        echo "$containername deployement complete"
                }
            }
//            stage('Cleaning Up') {
//                steps{
//                  sh "docker rmi --force $registry:v1.$BUILD_NUMBER"
//                }
//            }
        }
    }

def imagePrune(containerName){
    try {
        sh "docker stop $containerName"
    } catch(error){}
}

def runApp(containerName, httpPort){
        sh "docker run -d --rm -p $httpPort:5002 --name $containerName --env-file ./envfile $registry:v1.$BUILD_NUMBER"
        echo "Application started on port: ${httpPort} (http)"
}
