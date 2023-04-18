import fs from "fs";
import { docopt } from "docopt";
import prettyPackageJson from ".";
import { version } from "./package.json";

const doc = `
Usage:
  pretty-package-json [--write] [<file>...]
  pretty-package-json -h | --help
  pretty-package-json --version

Arguments:
  <file>  File to process, defaults to \`package.json\` or \`stdin\` if piped.

Options:
  -w, --write  Update file in place (has no effect when piped).
  -h, --help   Show this screen.
  --version    Show version.
`.trim();

function format(filePath: string, outputPath: string) {
  const pkg = JSON.parse(fs.readFileSync(filePath, "utf8"));

  fs.writeFileSync(
    outputPath,
    JSON.stringify(prettyPackageJson(pkg), null, 2) + "\n"
  );
}

function formatFile(file: string, write: boolean, fallbackPath: string) {
  format(file, write ? file : fallbackPath);

  if (write) {
    console.error(`Wrote: ${file}`);
  }
}

function cli(argv: string[]) {
  const args = docopt(doc, { argv, version });

  if (args["<file>"]) {
    const files: string[] = args["<file>"];

    files.forEach((file) => formatFile(file, args["--write"], "/dev/stdout"));
  }

  if (process.stdin.isTTY) {
    return formatFile("package.json", args["--write"], "/dev/stdout");
  }

  return format("/dev/stdin", "/dev/stdout");
}

export default cli;
