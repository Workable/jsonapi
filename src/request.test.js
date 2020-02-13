import request from "./request";
import resource from "./fixtures/resource";
import errors from "./fixtures/errors";

let timeoutId;
let abortSpy;
let realAbortController;

beforeEach(() => {
  realAbortController = global.AbortController;

  global.AbortController = function() {
    return {
      signal: {},
      abort: () => {
        clearTimeout(timeoutId);
        abortSpy();
      }
    };
  };

  clearTimeout(timeoutId);
  abortSpy = jest.fn();
});

afterEach(() => {
  global.AbortController = realAbortController;
});

it("submits a request", async () => {
  fetch.mockResponseOnce(JSON.stringify(resource));
  const response = await request("mockUrl");
  expect(response).toMatchSnapshot();
  expect(abortSpy).toBeCalledTimes(0);
});

it("aborts a request", async () => {
  jest.useFakeTimers();
  fetch.mockResponseOnce(
    () =>
      new Promise(
        resolve =>
          (timeoutId = setTimeout(
            () => resolve({ body: JSON.stringify(resource) }),
            0
          ))
      )
  );
  const successSpy = jest.fn();
  const promise = request("mockUrl");
  promise.then(successSpy);
  promise.abort();

  jest.advanceTimersByTime(10);
  expect(successSpy).not.toBeCalled();
  expect(abortSpy).toBeCalledTimes(1);
});

it("returns the jsonapi error", async () => {
  // should parse error content
  fetch.mockResponseOnce(new Error(JSON.stringify(errors)), { status: 422 });
  let error;
  try {
    await request("mockUrl");
  } catch (e) {
    error = e;
  }
  expect(error.status).toBe(422);
});
