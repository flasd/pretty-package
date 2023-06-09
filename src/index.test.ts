import { strictEqual } from "assert";
import prettyPackageJson, { Options } from ".";

function compare({
  opts,
  input,
  expected,
}: {
  opts?: Options;
  input: object;
  expected: object;
}) {
  const expectedString = JSON.stringify(expected, null, 2);
  const actualString = JSON.stringify(prettyPackageJson(input, opts), null, 2);

  strictEqual(actualString, expectedString);
}

describe("pretty-package-json", () => {
  it("should sort keys", () => {
    compare({
      input: {
        version: "0.2.0",
        author: {
          url: "https://www.example.com/",
          name: "Someone",
          email: "someone@example.com",
        },
        name: "foo",
        contributors: [
          {
            url: "https://hello.example.com/",
            name: "Someone Else",
          },
          "John Doe <john@doe.com> (https://john.doe.com/)",
        ],
        bugs: {
          email: "someone@example.com",
          url: "https://www.example.com/bugs",
        },
        devDependencies: {
          something: "^3.0.0",
          more: "^1.0.0",
        },
        description: "Some description.",
        bin: {
          foo: "foo",
        },
        engines: {
          npm: ">=6",
          node: ">=15",
        },
        repository: {
          type: "git",
          url: "git@github.com:user/repo.git",
        },
        scripts: {
          test: "test",
          lint: "lint",
        },
        dependencies: {
          foo: "^1.0.0",
          bar: "^2.0.0",
        },
        directories: {
          doc: "doc",
          bin: "bin",
          whatever: "whatever",
          man: "man",
          lib: "lib",
        },
        license: "Unlicense",
      },
      expected: {
        name: "foo",
        version: "0.2.0",
        description: "Some description.",
        bugs: {
          url: "https://www.example.com/bugs",
          email: "someone@example.com",
        },
        license: "Unlicense",
        author: "Someone <someone@example.com> (https://www.example.com)",
        contributors: [
          "Someone Else (https://hello.example.com)",
          "John Doe <john@doe.com> (https://john.doe.com)",
        ],
        bin: "foo",
        directories: {
          bin: "bin",
          doc: "doc",
          lib: "lib",
          man: "man",
          whatever: "whatever",
        },
        repository: "user/repo",
        scripts: {
          lint: "lint",
          test: "test",
        },
        dependencies: {
          bar: "^2.0.0",
          foo: "^1.0.0",
        },
        devDependencies: {
          more: "^1.0.0",
          something: "^3.0.0",
        },
        engines: {
          node: ">=15",
          npm: ">=6",
        },
      },
    });

    compare({
      opts: {
        sortScripts: false,
        peopleFormat: "long",
      },
      input: {
        author: "Someone <someone@example.com> (https://www.example.com)",
        contributors: [
          "Someone Else (https://hello.example.com)",
          "John Doe <john@doe.com> (https://john.doe.com)",
        ],
        scripts: {
          test: "test",
          lint: "lint",
        },
      },
      expected: {
        author: {
          name: "Someone",
          email: "someone@example.com",
          url: "https://www.example.com",
        },
        contributors: [
          {
            name: "Someone Else",
            url: "https://hello.example.com",
          },
          {
            name: "John Doe",
            email: "john@doe.com",
            url: "https://john.doe.com",
          },
        ],
        scripts: {
          test: "test",
          lint: "lint",
        },
      },
    });

    compare({
      input: {
        repository: "https://whatever.com/user/repo.git",
      },
      expected: {
        repository: "https://whatever.com/user/repo.git",
      },
    });

    compare({
      input: {
        repository: {
          url: "whatever",
          type: "unknown",
        },
      },
      expected: {
        repository: {
          type: "unknown",
          url: "whatever",
        },
      },
    });

    compare({
      input: {
        author: {},
        contributors: [],
      },
      expected: {},
    });

    compare({
      input: {
        bugs: {
          url: "https://www.example.com/issues",
        },
        repository: "foo/bar",
      },
      expected: {
        bugs: "https://www.example.com/issues",
        repository: "foo/bar",
      },
    });

    compare({
      input: {
        homepage: "https://github.com/foo/bar",
        bugs: {
          url: "https://github.com/foo/bar/issues",
        },
        repository: "foo/bar",
      },
      expected: {
        repository: "foo/bar",
      },
    });

    compare({
      input: {
        homepage: "https://github.com/foo/bar#readme",
        repository: "foo/bar",
      },
      expected: {
        repository: "foo/bar",
      },
    });

    compare({
      input: {
        name: "foo",
        bin: {
          bar: "bar",
        },
      },
      expected: {
        name: "foo",
        bin: {
          bar: "bar",
        },
      },
    });
  });
});
