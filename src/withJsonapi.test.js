import withJsonapi from "./withJsonapi";
import resource from "./fixtures/resource";
import errors from "./fixtures/errors";

it("submits a request", async () => {
  const request = withJsonapi(() => Promise.resolve(resource));
  const response = await request("mockUrl");
  expect(response).toMatchSnapshot();
});

it("returns a jsonapi error", async () => {
  const request = withJsonapi(() => Promise.reject({ response: errors }));
  let error;
  try {
    await request("mockUrl");
  } catch (e) {
    error = e;
  }
  expect(error).toEqual({ title: "can't be blank" });
});

it("returns a non jsonapi error", async () => {
  const request = withJsonapi(() => Promise.reject({ response: "error" }));
  let error;
  try {
    await request("mockUrl");
  } catch (e) {
    error = e;
  }
  expect(error).toBe("error");
});
