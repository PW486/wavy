#!/bin/bash

# Check if Project ID is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh <PROJECT_ID>"
    exit 1
fi

PROJECT_ID=$1
REGION="asia-northeast3"
ZONE="asia-northeast3-a"
IMAGE_NAME="wavy-app"
REPO_NAME="wavy-repo"
INSTANCE_NAME="wavy-instance"

echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "Enabling necessary APIs..."
gcloud services enable compute.googleapis.com artifactregistry.googleapis.com

echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Wavy app" || echo "Repository already exists"

echo "Configuring Docker for Artifact Registry..."
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

echo "Building and pushing Docker image..."
# Use Google Cloud Build to avoid local resources
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME .

echo "Creating GCE instance with container..."
gcloud compute instances create-with-container $INSTANCE_NAME \
    --container-image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME \
    --machine-type e2-micro \
    --zone $ZONE \
    --tags http-server \
    --labels app=wavy \
    --container-mount-host-path=mount-path=/app/db,host-path=/var/lib/wavy,mode=rw

echo "Setting up firewall rule for port 80..."
gcloud compute firewall-rules create allow-http-80 \
    --allow tcp:80 \
    --target-tags http-server \
    --description="Allow port 80 for Wavy app" || echo "Firewall rule already exists"

echo "Deployment complete!"
echo "You can access the app at http://<INSTANCE_IP>"
echo "To get the IP, run: gcloud compute instances describe $INSTANCE_NAME --zone $ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)'"
