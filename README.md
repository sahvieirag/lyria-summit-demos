# Lyria Music Studio

A web application that uses AI to generate music from text prompts and images.

## Prerequisites

*   Node.js and npm
*   Google Cloud SDK (gcloud CLI)

## Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

## Running Locally

1.  **Set up Application Default Credentials (ADC):**
    ```bash
    gcloud auth application-default login
    ```
2.  **Create a `.env` file** in the root of the project and add your Google Cloud Project ID:
    ```
    PROJECT_ID=your-google-cloud-project-id
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```
3.  **Start the development servers:**
    ```bash
    npm run dev
    ```
4.  The application will be available at `http://localhost:5173`.

## Deployment to Google Cloud Run

This project uses Google Cloud Build to automate the deployment to Cloud Run.

1.  **Enable the Cloud Build and Cloud Run APIs** in your Google Cloud project.
2.  **Configure the gcloud CLI** with your project ID:
    ```bash
    gcloud config set project YOUR_PROJECT_ID
    ```
3.  **Run the Cloud Build pipeline** with your project ID and desired service name. The `PROJECT_ID` will be automatically passed to the Cloud Run service as an environment variable.
    ```bash
    gcloud builds submit --config cloudbuild.yaml --substitutions=_SERVICE_NAME=your-service-name,_PROJECT_ID=your-project-id .
    ```