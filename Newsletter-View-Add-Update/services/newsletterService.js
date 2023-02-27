import axios from "axios";
import {API_HOST_PREFIX, onGlobalError, onGlobalSuccess} from "./serviceHelpers"

const endpoint = `${API_HOST_PREFIX}/api/newsletters/`;

const editNewsletter = (payload, id) => {

  const config = {
      method: `PUT`,
      url: `${endpoint}${id}`,
      data: payload,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }, 
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

const queryPaged = (pageIndex, pageSize, query) => {
  const config = {
    method: `GET`,
    url: `${endpoint}query/?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError) 
};

const deleteById = (id) => {

  const config = {
      method: `DELETE`,
      url: `${endpoint}${id}`,
      data: id,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }, 
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError)
};

let addNewsletter = (payload) => {

    const config = {
      method: "POST",
      url: `${endpoint}`,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
    return axios(config).catch(onGlobalSuccess).catch(onGlobalError);
  }
  
let addNewsletterWithContent = (payload) => {

  const config = {
    method: "POST",
    url: `${endpoint}composite`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config).catch(onGlobalSuccess).catch(onGlobalError);
}

let editNewsletterWithContent = (payload, id) => {

  const config = {
    method: "PUT",
    url: `${endpoint}composite/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config).catch(onGlobalSuccess).catch(onGlobalError);
}

export {
  editNewsletter, 
  getAllPaged,
  deleteById,
  addNewsletter,
  addNewsletterWithContent,
  editNewsletterWithContent,
  queryPaged
 };