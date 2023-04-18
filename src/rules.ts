import { sortObject, alphabeticalSortObject } from "./sort";
import parseAuthor from "parse-author";
import stringifyAuthor from "stringify-author";
import hostedGitInfo from "hosted-git-info";
import { Options } from ".";

function bugs(bugs: string | object) {
  if (typeof bugs === "string") {
    return bugs;
  }

  if (Object.keys(bugs).length === 1 && "url" in bugs) {
    return bugs.url;
  }

  return sortObject(["url", "email"], bugs);
}

function author(author: string | object, opts: Options) {
  if (typeof author === "string") {
    author = parseAuthor(author);
  }

  if (opts.peopleFormat === "long") {
    return sortObject(["name", "email", "url"], author);
  }

  return stringifyAuthor(author);
}

function contributors(contributors: Array<string | object>, opts: Options) {
  return contributors.map((contributor) => author(contributor, opts));
}

function bin(
  bin:
    | string
    | {
        [key: string]: any;
      },
  pkg: {
    [key: string]: any;
  }
) {
  if (typeof bin === "string") {
    return bin;
  }

  if (Object.keys(bin).length !== 1) {
    return bin;
  }

  if (pkg.name in bin) {
    return bin[pkg.name];
  }

  return bin;
}

function directories(directories: object) {
  return sortObject(["bin", "doc", "lib", "man"], directories);
}

function repository(
  repo:
    | string
    | {
        [key: string]: any;
      },
  opts: Options,
  pkg: {
    [key: string]: any;
  }
): string | object {
  if (typeof repo !== "string") {
    if (repo.type !== "git" || "directory" in repo) {
      return sortObject(["type", "url", "directory"], repo);
    }

    return repository(repo.url, opts, pkg);
  }

  const info = hostedGitInfo.fromUrl(repo);

  if (!info) {
    return repo;
  }

  if (
    "homepage" in pkg &&
    (info.docs() === pkg.homepage || info.browse() === pkg.homepage)
  ) {
    delete pkg.homepage;
  }

  if ("bugs" in pkg && info.bugs() === (pkg.bugs.url || pkg.bugs)) {
    delete pkg.bugs;
  }

  return info.shortcut().replace(/^github:/, "");
}

function scripts(scripts: object, opts: Options) {
  return opts.sortScripts ? alphabeticalSortObject(scripts) : scripts;
}

function engines(engines: object) {
  return sortObject(["node", "npm"], engines);
}

export default {
  bugs,
  author,
  contributors,
  bin,
  directories,
  repository,
  scripts,
  dependencies: alphabeticalSortObject,
  devDependencies: alphabeticalSortObject,
  peerDependencies: alphabeticalSortObject,
  optionalDependencies: alphabeticalSortObject,
  engines,
};
