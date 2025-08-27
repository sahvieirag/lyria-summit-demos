## Cloud setup;

Export project values:
```bash
export MY_PROJECT_ID="gcp-project-id"
export MY_PROJECT_NO="1234567890"
export MY_LOCATION="southamerica-east1"
export API_KEY_GEMINI="you-gemini-api-key"
``` 

Enable the following APIs: 
```bash
gcloud services enable cloudbuild.googleapis.com \
                       run.googleapis.com \
                       container.googleapis.com \
                       compute.googleapis.com \
                       artifactregistry.googleapis.com \
                       secretmanager.googleapis.com \
                       aiplatform.googleapis.com \
                       --project=$MY_PROJECT_ID
```

Create a Docker Repo on Artifact Registry: 
```bash
gcloud artifacts repositories create lyria-demo-repo \
       --repository-format=docker \
       --location=$MY_LOCATION \
       --description="My Docker Repository" \
       --no-immutable-tags
``` 

Grant a few IAM permissions:
```bash
gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/container.developer" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/iam.serviceAccountUser" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/run.admin" \
       --condition=None	

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/artifactregistry.admin" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/aiplatform.user" \
       --condition=None
```

Adjust substitutions on `cloudbuild.yaml` file:
```yaml
substitutions:
  _SERVICE_NAME: lyria-demo
  _SERVICE_REGION: southamerica-east1
  _TAG: 1.0.0
  _REPO_LOCATION: southamerica-east1
  _PROJECT_ID: gcp-project-id
  _VITE_GEMINI_API_KEY: your-api-key
  _REPO_ID: lyria-demo-repo
```

Run cloud build to deploy:
```bash
gcloud builds submit . --config=./cloudbuild.yaml --region=$MY_LOCATION --project=$MY_PROJECT_ID --substitutions=_PROJECT_ID=$MY_PROJECT_ID,_VITE_GEMINI_API_KEY=$API_KEY_GEMINI
```

