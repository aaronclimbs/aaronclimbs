// Include node fs (file stream, NOT file system) and https modules
const fs = require("fs");
const https = require("https");
const path = require("path");

require("isomorphic-unfetch");

// API endpoint
const url = "https://dev.to/api/articles?username=aaronclimbs";
// const url = "https://www.reddit.com/r/popular.json";

async function main() {
  /* const readmeTemplate = (
    await fs.readFile(path.join(process.cwd(), "./README.template.md"))
  ).toString("utf-8"); */
  const redditJSON = await (await fetch(url)).json();

  console.log(redditJSON);
}

const readWriteAsync = () => {
  // Get articles using HTTPS
  https
    .get(url, (res) => {
      res.setEncoding("utf8");

      // Set body to response data from API

      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          // Parse JSON response
          body = JSON.parse(body);

          // Shorten array to latest 4 articles
          // body = body.slice(0, 4);

          // Create string of markdown to be insterted
          const articles = body.reduce((acc, val) => {
            acc += `\n - [${val.title}](${val.url})`;
            return acc;
          }, "");

          // Update README using fs
          /* fs.readFile("README.md", "utf8", (err, data) => {
            if (err) {
              throw err;
            }

            // Replace text using regex: "I'm writing: ...replace... ![Projects"
            // Thanks to regexr as usual for the regex assistance.
            const updateMd = data.replace(
              /(?<=recent writing:\n)[\s\S]*(?=## Projects)/gim,
              articles
            );

            // Write the new README
            fs.writeFile("README.md", updateMd, "utf8", (err) => {
              if (err) {
                throw err;
              }

              console.log("README update finished.");
            });
          }); */
        } catch (error) {
          console.error(error.message);
        }
      });
    })
    .on("error", (error) => {
      console.error(error.message);
    });
};

// Call the function
// readWriteAsync();
main();
