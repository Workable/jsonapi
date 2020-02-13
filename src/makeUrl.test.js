import makeUrl from "./makeUrl";

const testIsParameterizeObject = p => {
  expect(Object.keys(p)).toEqual([
    "include",
    "only",
    "page",
    "limit",
    "sort",
    "filter",
    "search",
    "param",
    "value"
  ]);
  expect(p.include).toBeInstanceOf(Function);
  expect(p.only).toBeInstanceOf(Function);
  expect(p.page).toBeInstanceOf(Function);
  expect(p.limit).toBeInstanceOf(Function);
  expect(p.sort).toBeInstanceOf(Function);
  expect(p.filter).toBeInstanceOf(Function);
  expect(p.search).toBeInstanceOf(Function);
  expect(p.param).toBeInstanceOf(Function);
  expect(p.value).toBeInstanceOf(Function);
};

const testForUrl = (url, sep = "") => {
  const outputUrl = url || "";

  it("has functions to generate params", () =>
    testIsParameterizeObject(makeUrl(url)));

  describe("#value", () => {
    it("returns params string", () => {
      expect(
        makeUrl(url)
          .include(["account"])
          .filter("staffing", true)
          .only("job", ["title", "description"])
          .only("account", "name")
          .page(3)
          .limit(15)
          .sort(["title", "-description"])
          .search("term")
          .value()
      ).toBe(
        outputUrl +
          sep +
          "include=account&filter[staffing]=true&fields[job]=title,description&fields[account]=name&page[number]=3&page[size]=15&sort=title,-description&search=term"
      );
    });

    it("returns multiple params", () =>
      testIsParameterizeObject(makeUrl(url).filter()));
  });

  describe("#include", () => {
    it("includes array with values", () => {
      expect(
        makeUrl(url)
          .include(["1", "2"])
          .value()
      ).toBe(outputUrl + sep + "include=1,2");

      expect(
        makeUrl(url)
          .include(["test"])
          .value()
      ).toBe(outputUrl + sep + "include=test");
    });

    it("includes string", () => {
      expect(
        makeUrl(url)
          .include("1,2")
          .value()
      ).toBe(outputUrl + sep + "include=1,2");

      expect(
        makeUrl(url)
          .include("test")
          .value()
      ).toBe(outputUrl + sep + "include=test");
    });

    it("includes nothing for emtpy", () => {
      expect(
        makeUrl(url)
          .include([])
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .include("")
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).include()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .include("test")
          .include("test2")
          .value()
      ).toBe(outputUrl + sep + "include=test2");
    });
  });

  describe("#only", () => {
    it("selects attributes from resource with array", () => {
      expect(
        makeUrl(url)
          .only("test", ["1", "2"])
          .value()
      ).toBe(outputUrl + sep + "fields[test]=1,2");

      expect(
        makeUrl(url)
          .only("test", ["test"])
          .value()
      ).toBe(outputUrl + sep + "fields[test]=test");
    });

    it("selects attributes from resource with string", () => {
      expect(
        makeUrl(url)
          .only("test", "1,2")
          .value()
      ).toBe(outputUrl + sep + "fields[test]=1,2");

      expect(
        makeUrl(url)
          .only("test", "test")
          .value()
      ).toBe(outputUrl + sep + "fields[test]=test");
    });

    it("selects nothing for empty", () => {
      expect(
        makeUrl(url)
          .only("test", [])
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .only("test", "")
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .only("test")
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .only()
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).only()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .only("test", "1,2")
          .only("test", "3,4")
          .value()
      ).toBe(outputUrl + sep + "fields[test]=3,4");
    });

    it("adds more for different param keys", () => {
      expect(
        makeUrl(url)
          .only("test", "1,2")
          .only("test2", "3,4")
          .value()
      ).toBe(outputUrl + sep + "fields[test]=1,2&fields[test2]=3,4");
    });
  });

  describe("#page", () => {
    it("adds page param", () => {
      expect(
        makeUrl(url)
          .page("1")
          .value()
      ).toBe(outputUrl + sep + "page[number]=1");

      expect(
        makeUrl(url)
          .page(4)
          .value()
      ).toBe(outputUrl + sep + "page[number]=4");
    });

    it("doesn't add page param for emtpy", () => {
      expect(
        makeUrl(url)
          .page()
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .page("")
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).page()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .page(4)
          .page(5)
          .value()
      ).toBe(outputUrl + sep + "page[number]=5");
    });
  });

  describe("#limit", () => {
    it("limits results", () => {
      expect(
        makeUrl(url)
          .limit("1")
          .value()
      ).toBe(outputUrl + sep + "page[size]=1");

      expect(
        makeUrl(url)
          .limit(4)
          .value()
      ).toBe(outputUrl + sep + "page[size]=4");
    });

    it("doesn't add limit param for emtpy", () => {
      expect(
        makeUrl(url)
          .limit()
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .limit("")
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).limit()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .limit(4)
          .limit(5)
          .value()
      ).toBe(outputUrl + sep + "page[size]=5");
    });
  });

  describe("#sort", () => {
    it("sorts array with values", () => {
      expect(
        makeUrl(url)
          .sort(["1", "2"])
          .value()
      ).toBe(outputUrl + sep + "sort=1,2");

      expect(
        makeUrl(url)
          .sort(["test"])
          .value()
      ).toBe(outputUrl + sep + "sort=test");
    });

    it("sorts string", () => {
      expect(
        makeUrl(url)
          .sort("1,2")
          .value()
      ).toBe(outputUrl + sep + "sort=1,2");

      expect(
        makeUrl(url)
          .sort("test")
          .value()
      ).toBe(outputUrl + sep + "sort=test");
    });

    it("sorts nothing for emtpy", () => {
      expect(
        makeUrl(url)
          .sort([])
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .sort("")
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).sort()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .sort("1,2")
          .sort("3,4")
          .value()
      ).toBe(outputUrl + sep + "sort=3,4");
    });
  });

  describe("#filter", () => {
    it("filters results", () => {
      expect(
        makeUrl(url)
          .filter("1", "test")
          .value()
      ).toBe(outputUrl + sep + "filter[1]=test");

      expect(
        makeUrl(url)
          .filter("test", 4)
          .value()
      ).toBe(outputUrl + sep + "filter[test]=4");
    });

    it("doesn't add filter param for emtpy", () => {
      expect(
        makeUrl(url)
          .filter()
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .filter("", "")
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .filter("")
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).filter()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .filter("1", "test")
          .filter("1", "test2")
          .value()
      ).toBe(outputUrl + sep + "filter[1]=test2");
    });

    it("adds more for different param keys", () => {
      expect(
        makeUrl(url)
          .filter("test", "1,2")
          .filter("test2", "3,4")
          .value()
      ).toBe(outputUrl + sep + "filter[test]=1,2&filter[test2]=3,4");
    });
  });

  describe("#search", () => {
    it("searches for term", () => {
      expect(
        makeUrl(url)
          .search("1")
          .value()
      ).toBe(outputUrl + sep + "search=1");

      expect(
        makeUrl(url)
          .search(4)
          .value()
      ).toBe(outputUrl + sep + "search=4");
    });

    it("doesn't add search param for emtpy", () => {
      expect(
        makeUrl(url)
          .search()
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .search("")
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).search()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .search("ruby")
          .search("rails")
          .value()
      ).toBe(outputUrl + sep + "search=rails");
    });
  });

  describe("#param", () => {
    it("adds param", () => {
      expect(
        makeUrl(url)
          .param("location", "gr")
          .value()
      ).toBe(outputUrl + sep + "location=gr");

      expect(
        makeUrl(url)
          .param("location", 4)
          .value()
      ).toBe(outputUrl + sep + "location=4");
    });

    it("doesn't add param for emtpy", () => {
      expect(
        makeUrl(url)
          .param("location")
          .value()
      ).toBe(outputUrl + "");

      expect(
        makeUrl(url)
          .param("location", "")
          .value()
      ).toBe(outputUrl + "");
    });

    it("can be piped", () => testIsParameterizeObject(makeUrl(url).param()));

    it("overrides previous for same param keys", () => {
      expect(
        makeUrl(url)
          .param("location", "en")
          .param("location", "gr")
          .value()
      ).toBe(outputUrl + sep + "location=gr");
    });
  });
};

describe("default", () => testForUrl());

describe("with pathname or url", () => testForUrl("some/url/or/path", "?"));

describe("with params", () =>
  testForUrl("http://some.test/url/or/path?someoldparam=test", "&"));
