import axios from "axios";
import {API_HOST_PREFIX, onGlobalError, onGlobalSuccess} from "./serviceHelpers"

const endpoint = `${API_HOST_PREFIX}/api/newslettertemplates/`;

  const getTemplateById = (id) => { 

    const config = {
      method: `GET`,
      url: `${endpoint}?id=${id}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type" : "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError)
  };

  const getAllPaged = (pageIndex, pageSize) => {
    const config = {
      method: `GET`,
      url: `${endpoint}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError) 
  };

export {
    getTemplateById, getAllPaged
 };