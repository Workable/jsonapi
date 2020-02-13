import resourceData, { baseResourceData } from "./resourceData";
import included from "./included";
import meta from "./meta";

export const baseResource = {
  data: { ...baseResourceData },
  ...meta
};

export default {
  ...resourceData,
  ...included,
  ...meta
};
