import axios from 'axios';
import { Page } from '@/types/page'; // Assuming you have this type

const API_BASE_URL = 'http://localhost:8000/api/page';

export const saveNewPage = (content: any): Promise<Page | null> => {
  console.log("saveNewPage triggered. Content to be sent: ", content);
  const payload = { content };
  console.log(`Payload being sent to POST ${API_BASE_URL}/:`, payload);

  return axios.post<Page>(`${API_BASE_URL}/`, payload)
    .then(response => {
      console.log("Page saved successfully. Response data:", response.data);
      return response.data;
    })
    .catch(error => {
      console.error("Error saving new page:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
        console.error("Axios error status:", error.response?.status);
      }
      return null; // Or rethrow specific error types if preferred
    });
};

export const updateExistingPage = (pageId: number, content: any): Promise<Page | null> => {
  console.log(`updateExistingPage triggered for pageId: ${pageId}. Content: `, content);
  const payload = { content };
  console.log(`Payload being sent to PUT ${API_BASE_URL}/${pageId}:`, payload);

  return axios.put<Page>(`${API_BASE_URL}/${pageId}`, payload)
    .then(response => {
      console.log("Page updated successfully. Response data:", response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Error updating page ${pageId}:`, error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
        console.error("Axios error status:", error.response?.status);
      }
      return null;
    });
};

export const getPageById = (pageId: number): Promise<Page | null> => {
  console.log(`getPageById triggered for pageId: ${pageId}`);

  return axios.get<Page>(`${API_BASE_URL}/${pageId}`)
    .then(response => {
      console.log("Page fetched successfully. Response data:", response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Error fetching page ${pageId}:`, error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
        if (error.response?.status === 404) {
          return null; // Explicitly return null for 404, as it's an expected "not found" case
        }
        console.error("Axios error status:", error.response?.status);
        // For other errors, you might want to rethrow or handle differently
        // For now, returning null for simplicity, aligning with previous try/catch behavior.
        return null;
      } else {
        // Non-Axios error
        throw error; // Rethrow if it's not an Axios error and needs different handling
      }
    });
}; 

export const deletePage = (pageId: number): Promise<void> => {
  return axios.delete(`${API_BASE_URL}/${pageId}`)
    .then(() => {
      console.log(`Page ${pageId} deleted successfully`);
    })
    .catch(error => {
      console.error(`Error deleting page ${pageId}:`, error);
    });
}
