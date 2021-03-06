// Include node fs (file stream, NOT file system) and https modules
const { promises: fs } = require("fs");
const path = require("path");

require("isomorphic-unfetch");

// API endpoint
const url = "https://dev.to/api/articles?username=aaronclimbs";
// const url = "https://www.reddit.com/r/popular.json";

async function main() {
  const readmeTemplate = (
    await fs.readFile(path.join(process.cwd(), "./README.template.md"))
  ).toString("utf-8");

  let devJson = await (await fetch(url)).json();

  lastFourArticles = devJson.slice(0, 4);

  let articles = lastFourArticles.reduce((acc, val) => {
    acc += `\n - [${val.title}](${val.url})`;
    return acc;
  }, "");

  const readme = readmeTemplate.replace(
    /(?<=recent writing\n)[\s\S]*(?=## Skills)/gim,
    `${articles}\n\n`
  );

  // Write the new README
  await fs.writeFile("README.md", readme);
}

main();
