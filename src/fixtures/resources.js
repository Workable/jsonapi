import resourceData from "./resourceData";
import included from "./included";
import meta from "./meta";

export default {
  data: [
    {
      ...resourceData.data
    }
  ],
  ...included,
  ...meta
};
