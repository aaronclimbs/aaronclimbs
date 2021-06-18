// Include node fs (file stream, NOT file system) and https modules
const fs = require("fs");
const https = require("https");

// API endpoint
const url = "https://dev.to/api/articles?username=aaronclimbs";

const readWriteAsync = () => {
  // Get articles using HTTPS
  https.get(url, (res) => {
    res.setEncoding("utf8");

    // Set body to response data from API
    let body = "";
    res.on("data", (data) => (body += data));

    res.on("end", () => {
      // Parse JSON response
      body = JSON.parse(body);

      // Shorten array to latest 4 articles
      body = body.slice(0, 4);

      // Create string of markdown to be insterted
      const articles = body.reduce((acc, val) => {
        acc += `\n - [${val.title}](${val.url})`;
        return acc;
      }, "");
      
      articles += "\n"

      // Update README using fs
      fs.readFile("README.md", "utf8", (err, data) => {
        if (err) {
          throw err;
        }

        // Replace text using regex: "I'm writing: ...replace... ![Projects"
        // Thanks to regexr as usual for the regex assistance.
        const updateMd = data.replace(
          /(?<=recent writing:\n)[\s\S]*(?=\!\[Projects)/gim,
          articles
        );

        // Write the new README
        fs.writeFile("README.md", updateMd, "utf8", (err) => {
          if (err) {
            throw err;
          }

          console.log("README update finished.");
        });
      });
    });
  });
};

// Call the function
readWriteAsync();
