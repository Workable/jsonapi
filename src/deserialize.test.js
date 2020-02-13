import parse from "./deserialize";
import resource, { baseResource } from "./fixtures/resource";
import resources from "./fixtures/resources";
import errors from "./fixtures/errors";

it("parses resource", () => expect(parse(resource)).toMatchSnapshot());

it("parses resources", () => expect(parse(resources)).toMatchSnapshot());

it("parses resource with no relationships", () =>
  expect(parse(baseResource)).toMatchSnapshot());

it("parses the resources type", () =>
  expect(parse({ data: { id: "my_id", type: "my_type" } })).toEqual({
    myType: { id: "my_id", type: "myType" }
  }));

it("parses single resource without id", () =>
  expect(parse({ data: { type: "my_type" } })).toEqual({
    myType: { id: undefined, type: "myType" }
  }));

it("parses single resource without type", () =>
  expect(parse({ data: { id: "someId" } })).toEqual({
    data: { id: "someId", type: "data" }
  }));

it("parses resources without id", () =>
  expect(parse({ data: [{ type: "my_type" }] })).toEqual({
    myType: [{ id: undefined, type: "myType" }]
  }));

it("parses resources without type", () =>
  expect(parse({ data: [{ id: "someId" }] })).toEqual({
    data: [{ id: "someId", type: "data" }]
  }));

it("ignores empty relationships", () =>
  expect(
    parse({
      data: {
        id: "someId",
        relationships: {
          myFirst: { data: null },
          mySecond: { data: { id: 1 } }
        }
      }
    })
  ).toEqual({
    data: { id: "someId", type: "data", mySecondId: 1 }
  }));

it("parses errors", () => expect(parse(errors)).toMatchSnapshot());

it("returns empty for errors not in array", () =>
  expect(parse({ errors: { title: "is blank" } })).toEqual({}));

it("returns empty for empty input", () => expect(parse()).toBeUndefined());

it("returns input on non object input", () =>
  expect(parse("some string")).toBe("some string"));

it("returns input if object misses required attrs - meta, data, errors", () =>
  expect(parse({ title: "some string" })).toEqual({ title: "some string" }));

it("returns only the required attrs - meta, data, errors", () => {
  expect(parse({ title: "some string", meta: {} })).toEqual({ meta: {} });
  expect(parse({ title: "some string", data: {} })).toEqual({
    data: { id: undefined, type: "data" }
  });
  expect(parse({ title: "some string", errors: {} })).toEqual({});
  expect(
    parse({ title: "some string", meta: {}, data: {}, errors: {} })
  ).toEqual({});
});
