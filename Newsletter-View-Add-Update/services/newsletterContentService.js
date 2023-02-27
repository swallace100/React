import axios from "axios";
import {API_HOST_PREFIX, onGlobalError, onGlobalSuccess} from "./serviceHelpers"

const endpoint = `${API_HOST_PREFIX}/api/newslettercontent/`;

  const getContentByNewsletterId = (id) => { 

    const config = {
      method: `GET`,
      url: `${endpoint}${id}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type" : "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError)
  };

export {
  getContentByNewsletterId
 };