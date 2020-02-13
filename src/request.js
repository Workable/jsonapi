import request from "@workablehr/request";
import deserialize from "./deserialize";

const requestJsonapi = (...args) => {
  const requestPromise = request(...args);
  const deserializePromise = requestPromise.then(deserialize).catch(error => {
    throw deserialize(error.response);
  });
  deserializePromise.abort = requestPromise.abort;
  return deserializePromise;
};

requestJsonapi.post = (url, data, params) =>
  requestJsonapi(url, {
    ...params,
    method: "POST",
    ...(data && { body: JSON.stringify(data) })
  });

requestJsonapi.put = (url, data, params) =>
  requestJsonapi(url, {
    ...params,
    method: "PUT",
    ...(data && { body: JSON.stringify(data) })
  });

export default requestJsonapi;
