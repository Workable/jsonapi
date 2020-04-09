import deserialize from "./deserialize";

const safeDeserialize = (error, body) => {
  try {
    error.serialized = deserialize(body);
  } catch (e) {}

  return error;
};

export default (request) => (...args) => {
  const promise = request(...args);

  const parsedPromise = promise.then(deserialize).catch((error) => {
    if (!error) throw error;

    if (!error.asyncHandler) {
      throw error.response ? deserialize(safeDeserialize(error, error.response)) : error;
    }

    return error.asyncHandler.then(
      hadler =>
        new Promise((resolve, reject) =>
          hadler.always(body => reject(safeDeserialize(error, body))).handle()
        )
    );
  });

  parsedPromise.abort = promise.abort;
  return parsedPromise;
};
