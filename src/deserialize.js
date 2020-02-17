import { camelizeKeys, camelCase } from "@workablehr/object-transformator";

/**
 * @description A helper for deserializing JSON:API schema objects.
 * @example
 * deserialize({
 *   data: [
 *     {
 *       id: 1,
 *       type: "type1",
 *       attributes: { attr1: "value1" },
 *       relationships: { type2: { data: { id: 2, type: "type2" } } }
 *     }
 *   ],
 *   included: [{ type: "type2", id: 2, attributes: { attr2: "value2" } }]
 * });
 *
 * {
 *   type1: [{ id: 1, attr1: "value1", type: "type1", type2Id: 2 }],
 *   type2: { id: 2, attr2: "value2", type: "type2" }
 * }
 */

const defaultType = "data";

const camelize = data => ({
  in: key => (data ? { [key]: camelizeKeys(data) } : {})
});

const normalizeRelationships = relationships => {
  if (!relationships) return {};

  return Object.keys(relationships).reduce((h, relationship) => {
    const { data } = relationships[relationship];
    if (!data) return h;

    const resourceName = camelCase(relationship);

    if (Array.isArray(data)) {
      return {
        ...h,
        [`${resourceName}Ids`]: data.map(({ id }) => id)
      };
    }

    return {
      ...h,
      [`${resourceName}Id`]: data.id
    };
  }, {});
};

const normalizeErrors = errors => {
  if (!Array.isArray(errors)) return {};

  return errors.reduce(
    (result, error) => ({
      ...result,
      [error.source.pointer]: error.detail
    }),
    {}
  );
};

const normalizeResource = resource => {
  const { id, type, attributes, relationships, meta, links } = resource;

  const resourceType = camelCase(type || defaultType);

  return {
    ...camelizeKeys(attributes),
    ...camelize(meta).in("meta"),
    ...camelize(links).in("links"),
    ...normalizeRelationships(relationships),
    id,
    type: resourceType
  };
};

const normalizeResources = dataArray =>
  dataArray.reduce((h, item) => {
    const resource = normalizeResource(item);
    const type = resource.type;

    if (!h[type]) h[type] = []; // Normalize collection for resource type

    return {
      ...h,
      [type]: [...h[type], resource]
    };
  }, {});

const normalizeData = data => {
  if (!data) return {};
  if (Array.isArray(data)) return normalizeResources(data);

  const resource = normalizeResource(data);
  return {
    [resource.type]: resource
  };
};

const deserialize = ({ errors, ...payload }) => {
  if (errors) return normalizeErrors(errors);

  const { data, meta, links, included } = payload;
  return {
    ...normalizeData(data),
    ...camelize(meta).in("meta"),
    ...camelize(links).in("links"),
    ...normalizeData(included)
  };
};

export default json => {
  if (!json || typeof json !== "object") return json;
  if (!json.data && !json.errors && !json.meta) return json;

  return deserialize(json);
};
