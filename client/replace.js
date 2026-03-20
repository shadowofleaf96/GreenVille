const fs = require("fs");
const path = require("path");

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (
        !fullPath.includes("node_modules") &&
        !fullPath.includes(".git") &&
        !fullPath.includes(".next")
      ) {
        replaceInDir(fullPath);
      }
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".jsx")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("sonner")) {
        content = content.replace(/['"]react-toastify['"]/g, '"sonner"');
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`Replaced in ${fullPath}`);
      }
    }
  }
}

replaceInDir("c:\\Users\\simok\\Bureau\\GreenVille\\client");
