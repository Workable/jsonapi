import relationships from "./relationships";

export const baseResourceData = {
  id: "210136031",
  type: "job",
  attributes: {
    title: "Head of Security",
    industry: "Marketing and Advertising",
    country_code: "US",
    country_name: "United States",
    state_code: "AK",
    city: "Anchorage",
    subregion: "Alaska",
    keywords: ["general management"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    requirements:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \u003cul\u003e\u003cli\u003eAenean commodo ligula eget dolor?\u003c/li\u003e\u003c/ul\u003e",
    benefits:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."
  }
};

export default {
  data: {
    ...baseResourceData,
    ...relationships
  }
};
