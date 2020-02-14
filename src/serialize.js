import { underscoredKeys, snakeCase } from "@workablehr/object-transformator";

/**
 * @description A helper for generating JSON:API schema applicable objects.
 * @example
 * serialize('job', jobAttrs)
 *   .include('account', accountId)
 *   .meta(metaAttrs)
 *   .value();
 */

const createParams = (type, attrs) => {
  if (!type || !attrs) {
    return {};
  }

  return {
    data: {
      type: snakeCase(type),
      attributes: underscoredKeys(attrs)
    }
  };
};

const initParams = (obj, ...args) =>
  args.reduce((h, arg) => h[arg] || (h[arg] = {}), obj);

const addData = (relationship, data) => {
  if (Array.isArray(relationship.data)) {
    return [...relationship.data, data];
  }

  if (typeof relationship.data === "object") {
    return [relationship.data, data];
  }

  return data;
};

const serialize = (resourceType, resourceAttrs) => {
  const params = createParams(resourceType, resourceAttrs);

  const _ = {
    include: (includeType, id) => {
      const type = snakeCase(includeType);
      const relationship = initParams(params.data, "relationships", type);
      const data = { type, id };
      relationship.data = addData(relationship, data);
      return _;
    },
    meta: metaAttrs => {
      params.meta = {
        ...initParams(params, "meta"),
        ...underscoredKeys(metaAttrs)
      };
      return _;
    },
    value: () => params
  };
  return _;
};

export default serialize;
