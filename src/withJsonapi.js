import deserialize from "./deserialize";

export default request => (...args) => {
  const promise = request(...args);

  const parsedPromise = promise.then(deserialize).catch(error => {
    throw error.response ? deserialize(error.response) : error;
  });

  parsedPromise.abort = promise.abort;
  return parsedPromise;
};
