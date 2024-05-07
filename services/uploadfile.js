// services/upload-files.service.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Adjust if your Flask app is hosted differently

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();
    formData.append("file", file);

    return axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return axios.get(`${BASE_URL}/files`);
  }
}

export default new UploadFilesService();
