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

echo "Creating/Updating GCE instance..."
gcloud compute instances create-with-container $INSTANCE_NAME \
    --container-image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME \
    --machine-type e2-micro \
    --zone $ZONE \
    --tags http-server \
    --labels app=wavy \
    --container-mount-host-path=mount-path=/app/db,host-path=/tmp/wavy-db,mode=rw \
    --boot-disk-size=10GB \
    --boot-disk-type=pd-standard \
    --restart-on-failure || \
gcloud compute instances update-container $INSTANCE_NAME \
    --container-image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME \
    --zone $ZONE

echo "Ensuring firewall rule 'allow-http' exists..."
gcloud compute firewall-rules create default-allow-http-80 \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server \
    --description="Allow HTTP port 80" || echo "Firewall rule already exists."

echo "Waiting for external IP..."
sleep 5
EXTERNAL_IP=$(gcloud compute instances describe $INSTANCE_NAME --zone $ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "--------------------------------------------------------"
echo "DEPLOYMENT FINISHED!"
echo "URL: http://$EXTERNAL_IP"
echo "--------------------------------------------------------"
echo "If you still cannot access it, run this to see app logs:"
echo "gcloud compute instances get-serial-port-output $INSTANCE_NAME --zone $ZONE"
echo "--------------------------------------------------------"