# jsonapi

jsonapi provides the url composition, serialize and deserialize functionality that implements the JSON:API schema.

Read more about [JSON:API schema](https://jsonapi.org/)

## installing

Using npm:

```
$ npm install @workablehr/jsonapi
```

## Basic usage

```javascript
const payload = serialize("sourceName", {
  attr1: "value1",
  attr2: "value2"
}).value();
const url = makeUrl("sourceName")
  .include("source2")
  .filter("fieldName", ["fieldValue"]);

request(url, { body: payload })
  .then(deserialize)
  .catch(error => {
    throw deserialize(error);
  });
```

## Serialize

A helper for generating JSON:API schema objects.

```javascript
serialize("job", jobAttrs)
  .include("account", accountId)
  .meta(metaAttrs)
  .value();
```

## Deserialize

A helper for deserializing JSON:API schema objects.

```javascript
deserialize({
  data: [
    {
      id: 1,
      type: "type1",
      attributes: { attr1: "value1" },
      relationships: { type2: { data: { id: 2, type: "type2" } } }
    }
  ],
  included: [{ type: "type2", id: 2, attributes: { attr2: "value2" } }]
});

// {
//   type1: [{ id: 1, attr1: "value1", type: "type1", type2Id: 2 }],
//   type2: { id: 2, attr2: "value2", type: "type2" }
// }
```

## makeUrl

A helper for generating search queries according to JSON:API schema

```javascript
makeUrl("resource.com")
  .include(["account"])
  .filter("staffing", true)
  .only("job", ["title", "description"])
  .only("account", "name")
  .page(3)
  .limit(15)
  .sort(["title", "-description"])
  .search("some term")
  .value();

// resource.com?include=account&filter[staffing]=true&fields[job]=title,description&fields[account]=name&page[number]=3&page[size]=15&sort=title,-description
```

## Recommended usage

The jsonapi matches perfectly with the `@workablehr/request` middlewares.
You can easily compose a json api request that returns a deserialized response.

```javascript
import request from "@workablehr/request";
import withJsonapi from "@workablehr/jsonapi";

const jsonapiRequest = withJsonapi(request);

jsonapiRequest("resource.com").then(response => {
  console.log(response);
});
```
