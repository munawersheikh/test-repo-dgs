import axios from "axios";
import { Utilities } from "./Utilities";

const E64_API = process.env.REACT_APP_E64_API;
const DGS_API = process.env.REACT_APP_DGS_API;
const email = process.env.REACT_APP_EMAIL;
const password = process.env.REACT_APP_PASSWORD;
const environment = process.env.REACT_APP_ENVIRONMENT;
const utils = new Utilities();

let token: string | null = null;
let tokenExpirationTime: number | null = null;

const fetchToken = async () => {
  try {
    const bodyData = { email, password };
    const response = await axios.post(`${E64_API}/users/login`, bodyData);
    token = response.data.token;
    tokenExpirationTime = Date.now() + 3600 * 1000; // Assuming the token expires in 1 hour (3600 seconds)
    return token;
  } catch (e) {
    console.error("Error fetching token: ", e);
    token = null;
    tokenExpirationTime = null;
    return token;
  }
};

const getToken = async () => {
  if (!token || !tokenExpirationTime || Date.now() >= tokenExpirationTime) {
    await fetchToken();
  }
  return token;
};

// Setting up an axios instance
const apiClient = axios.create();

// Adding request interceptor to show loader
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  console.log("Token: ", token)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Show the spinner loader
  const event = new Event('showSpinner');
  window.dispatchEvent(event);

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Adding response interceptor to hide loader
apiClient.interceptors.response.use(
  (response) => {
    // Hide the spinner loader after 2 seconds
    setTimeout(() => {
      const event = new Event('hideSpinner');
      window.dispatchEvent(event);
    }, 1000); // 2 seconds delay

    return response;
  },
  (error) => {
    // Hide the spinner loader even if there is an error
    setTimeout(() => {
      const event = new Event('hideSpinner');
      window.dispatchEvent(event);
    }, 1000); // 2 seconds delay

    return Promise.reject(error);
  }
);

export const fetchNodes = async () => {
  try {
    console.log('Nodes API Call Initiated');
    console.log('Request URL:', `${E64_API}/nodes/`);

    const response = await apiClient.get(`${E64_API}/nodes/`);

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Body:', response.data);

    return response.data;
  } catch (e) {
    console.error("Error fetching nodes data: ", e);
    return [];
  }
};

export const updateNode = async (id: number, alias: string) => {
  try {
    const response = await apiClient.put(`${E64_API}/nodes/${id}`, { alias });
    return response.data;
  } catch (e) {
    console.error("Error updating node data: ", e);
    return null;
  }
};

export const getCollections = async (limit: number, start: number) => {
  try {

    console.log('Collections API Call Initiated');
    console.log('Request URL:', `${DGS_API}/icc/table`);
    console.log('Request Options:', { limit, start });

    const response = await axios.get(`${DGS_API}/icc/table`, {
      params: {
        limit: limit,
        start: start
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Body:', response.data);

    return response.data;

  } catch (e) {
    console.error("Error while getting data: ", e);
    return null;
  }
};

export const getChopData = async (job_recid: number, min_create_date: string, max_create_date: string) => {
  try {



    job_recid = environment !== "local" ? job_recid : 417;

    console.log('CHOP API Call Initiated');
    console.log('Request URL:', `${DGS_API}/icc/api/chop_output/${job_recid}`);
    console.log('Request Options:', { min_create_date, max_create_date });

    const response = await axios.get(`${DGS_API}/icc/api/chop_output/${job_recid}`, {
      params: {
        collect_start: utils.formatUrlTime(min_create_date),
        collect_end: utils.formatUrlTime(max_create_date),
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Body:', response.data);

    return response.data;
  } catch (e) {
    console.error("Error while getting data: ", e);
    return null;
  }
};

export const getPsdData = async (params: any) => {
  try {
    console.log('PSD API Call Initiated');
    console.log('Request URL:', `${DGS_API}/icc/api/get_average_psd_data_mask_threshold`);
    console.log('Request Options:', params);

    const response = await axios.get(`${DGS_API}/icc/api/get_average_psd_data_mask_threshold`, {
      params: {
        count: params.count,
        start_time: utils.formatUrlTime(params.start_time),
        end_time: utils.formatUrlTime(params.end_time),
        mask_start_time: utils.formatUrlTime(params.mask_start_time),
        mask_end_time: utils.formatUrlTime(params.mask_end_time),
        threshold: params.threshold,
        job_recid: params.job_recid,
        operation: params.operation,
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Body:', response.data);

    return response.data;
  } catch (e) {
    console.error("Error while getting data: ", e);
    return null;
  }
};
