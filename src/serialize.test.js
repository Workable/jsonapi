import serialize from "./serialize";

it("creates empty payload", () => {
  expect(serialize().value()).toEqual({});
});

it("creates payload with meta data", () => {
  expect(
    serialize("job", {})
      .meta({ hello: "world" })
      .value()
  ).toEqual({
    data: {
      type: "job",
      attributes: {}
    },
    meta: { hello: "world" }
  });
});

it("creates payload with resource", () => {
  expect(
    serialize("job", {
      title: "Software",
      userId: "uid",
      location: undefined
    }).value()
  ).toEqual({
    data: {
      type: "job",
      attributes: {
        title: "Software",
        user_id: "uid",
        location: undefined
      }
    }
  });
});

it("creates payload with one relationship", () => {
  expect(
    serialize("job", { title: null, userId: "uid" })
      .include("userAccount", "uAccountId")
      .value()
  ).toEqual({
    data: {
      type: "job",
      attributes: {
        title: null,
        user_id: "uid"
      },
      relationships: {
        user_account: {
          data: {
            id: "uAccountId",
            type: "user_account"
          }
        }
      }
    }
  });
});

it("creates payload with many relationships", () => {
  expect(
    serialize("job", { title: null, userId: "uid" })
      .include("userAccount", "uAccountId1")
      .include("userAccount", "uAccountId2")
      .include("userAccount", "uAccountId3")
      .include("bucket_bin", "bb1")
      .include("bucket_bin", "bb2")
      .include("question", "q1")
      .value()
  ).toEqual({
    data: {
      type: "job",
      attributes: {
        title: null,
        user_id: "uid"
      },
      relationships: {
        user_account: {
          data: [
            {
              id: "uAccountId1",
              type: "user_account"
            },
            {
              id: "uAccountId2",
              type: "user_account"
            },
            {
              id: "uAccountId3",
              type: "user_account"
            }
          ]
        },
        bucket_bin: {
          data: [
            {
              id: "bb1",
              type: "bucket_bin"
            },
            {
              id: "bb2",
              type: "bucket_bin"
            }
          ]
        },
        question: {
          data: {
            id: "q1",
            type: "question"
          }
        }
      }
    }
  });
});
