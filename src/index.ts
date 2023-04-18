import { sortObject } from "./sort";
import rules from "./rules";
import sortedKeys from "./keys.json";

export type Options = {
  sortScripts: boolean;
  peopleFormat: string;
};

function prettyPackageJson(
  pkg: {
    [key: string]: any;
  },
  opts: Partial<Options> = {}
) {
  const options: Options = Object.assign({}, prettyPackageJson.defaults, opts);

  for (const key of Object.keys(pkg)) {
    if (Array.isArray(pkg[key] && !pkg[key].length)) {
      delete pkg[key];
    }

    if (typeof pkg[key] === "object" && !Object.keys(pkg[key]).length) {
      delete pkg[key];
    }
  }

  pkg = sortObject(sortedKeys, pkg);

  for (const [key, rule] of Object.entries(rules)) {
    if (key in pkg) {
      pkg[key] = rule(pkg[key], options, pkg);
    }
  }

  return pkg;
}

prettyPackageJson.defaults = {
  sortScripts: true,
  peopleFormat: "string",
} as Options;

export default prettyPackageJson;
