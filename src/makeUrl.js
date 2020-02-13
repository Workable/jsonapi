const identity = i => i;

const stringifyList = (keys = "") => {
  if (!Array.isArray(keys)) keys = keys.split(",");
  return keys.join(",");
};

const stringifyParams = (params, { wrapParam = identity } = {}) => {
  return Object.keys(params).reduce((h, param, index) => {
    const values = params[param];
    if (!values) return h;

    const sep = index === 0 ? "" : "&";
    if (typeof values !== "object" || Array.isArray(values) || values === null)
      return `${h}${sep}${wrapParam(param)}=${values}`;
    return `${h}${sep}${stringifyParams(values, {
      wrapParam: p => `${param}[${p}]`
    })}`;
  }, "");
};

/**
 * @description A helper for generating search queries according to JSON:API schema
 * @example
 * makeUrl(url)
 *   .include(['account'])
 *   .filter('staffing', true)
 *   .only('job', ['title', 'description'])
 *   .only('account', 'name')
 *   .page(3)
 *   .limit(15)
 *   .sort(['title', '-description'])
 *   .search('some term')
 *   .value()
 *
 * will produce => url?include=account&filter[staffing]=true&fields[job]=title,description&fields[account]=name&page[number]=3&page[size]=15&sort=title,-description
 */

export default url => {
  const params = {};

  const initParam = (obj, attr) => !obj[attr] && (obj[attr] = {});

  const param = key => {
    let obj = params;

    const actions = {
      set: value => (obj[key] = value),
      on: parentKey => {
        initParam(obj, parentKey);
        obj = params[parentKey];
        return actions;
      }
    };
    return actions;
  };

  const parameterize = {
    include: resources => {
      param("include").set(stringifyList(resources));
      return parameterize;
    },
    only: (resource, attrs) => {
      param(resource)
        .on("fields")
        .set(stringifyList(attrs));
      return parameterize;
    },
    page: num => {
      param("number")
        .on("page")
        .set(num);
      return parameterize;
    },
    limit: num => {
      param("size")
        .on("page")
        .set(num);
      return parameterize;
    },
    sort: attrs => {
      param("sort").set(stringifyList(attrs));
      return parameterize;
    },
    filter: (attr, value) => {
      param(attr)
        .on("filter")
        .set(value);
      return parameterize;
    },
    search: value => {
      param("search").set(value);
      return parameterize;
    },
    param: (attr, value) => {
      param(attr).set(value);
      return parameterize;
    },
    value: () => {
      const searchQuery = stringifyParams(params);

      if (!url) return searchQuery;
      if (!searchQuery) return url;
      if (/\?/.test(url)) return `${url}&${searchQuery}`;
      return `${url}?${searchQuery}`;
    }
  };

  return parameterize;
};
