### Prerequisites

Before starting, ensure that the following tools are installed on your system:
- **Node.js**: Download and install Node.js (which includes npm) from [nodejs.org](https://nodejs.org/).
- **Git**: Install Git from [git-scm.com](https://git-scm.com/).

Optional but recommended:
- **Yarn**: Install Yarn via npm with `npm install -g yarn`.

### Cloning the Repository

1. **Clone the Repository**:
   Open your terminal and run the following command to clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

### Setting Up the Backend

1. **Navigate to the Server Directory**:
   If your backend code is in a separate directory, navigate into it:
   ```bash
   cd backend  # Adjust this path based on your project structure
   ```

2. **Install Dependencies**:
   Install necessary Node.js packages:
   ```bash
   npm install
   ```
   or if using Yarn:
   ```bash
   yarn install
   ```

3. **Configure Google Earth Engine**:
   - Place your Google Earth Engine private key (JSON file) in your project. Ensure it’s referenced correctly in your Express application.
   - Add environment variables as needed (e.g., PORT, GOOGLE_APPLICATION_CREDENTIALS).

4. **Start the Server**:
   Start the backend server using:
   ```bash
   npm start
   ```
   or with Yarn:
   ```bash
   yarn start
   ```

### Setting Up the Frontend

1. **Navigate to the Frontend Directory**:
   If your frontend code is in a separate directory, navigate into it:
   ```bash
   cd frontend  # Adjust this path based on your project structure
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   or with Yarn:
   ```bash
   yarn install
   ```

3. **Start the Frontend Application**:
   Run the React application:
   ```bash
   npm start
   ```
   or with Yarn:
   ```bash
   yarn start
   ```
   This will open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Testing the Application

- **Functional Test**: Use the application to upload a CSV file and verify that the frontend communicates correctly with the backend, processing data as expected.
- **Console Logs**: Check both the browser and server console logs for any errors or important messages.

### Troubleshooting Common Issues

- **Dependency Errors**: If you encounter errors related to missing packages or dependencies, ensure that `npm install` or `yarn install` has been run in both the frontend and backend directories.
- **CORS Issues**: Make sure the CORS policy on your server is configured to allow requests from your frontend.
- **Environment Variables**: Check that all necessary environment variables are set correctly for the backend to function, particularly those relating to Google Earth Engine.

Here is the previous code that this project is based on: 
https://utexas.app.box.com/file/749449409500
git repo: 
https://github.com/utkimchi/suspect_calculator/blob/master/Max_Uncertainity_Estimates.py