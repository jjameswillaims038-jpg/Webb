import JSZip from "jszip";
import fetch from "node-fetch";
import { parse } from "node-html-parser";
import path from "path";
import { URL } from "url";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: "Invalid URL" });

  try {
    const response = await fetch(url);
    const htmlText = await response.text();
    const root = parse(htmlText);

    const zip = new JSZip();

    // Save main HTML
    zip.file("index.html", htmlText);

    // Function to fetch and add assets
    const fetchAndAdd = async (assetUrl, folder) => {
      try {
        const absolute = new URL(assetUrl, url).href;
        const assetRes = await fetch(absolute);
        const buffer = await assetRes.arrayBuffer();
        const filename = path.basename(new URL(absolute).pathname);
        zip.folder(folder).file(filename, Buffer.from(buffer));
      } catch (e) {
        console.log("Failed asset:", assetUrl, e.message);
      }
    };

    // Fetch linked CSS
    const links = root.querySelectorAll("link[rel='stylesheet']");
    for (let link of links) {
      const href = link.getAttribute("href");
      if (href) await fetchAndAdd(href, "css");
    }

    // Fetch JS
    const scripts = root.querySelectorAll("script[src]");
    for (let script of scripts) {
      const src = script.getAttribute("src");
      if (src) await fetchAndAdd(src, "js");
    }

    // Fetch images
    const imgs = root.querySelectorAll("img");
    for (let img of imgs) {
      const src = img.getAttribute("src");
      if (src) await fetchAndAdd(src, "assets");
    }

    // Add README
    const readme = `
# Copied Website

This website was copied using Mr Dev Tools Web Copier.

## Structure
- index.html
- css/ → all stylesheets
- js/ → all scripts
- assets/ → images

## Deploy
- Upload all folders to any hosting (Vercel, Netlify, GitHub Pages)
- Ensure relative links remain correct
`;
    zip.file("README.md", readme);

    const buffer = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=site.zip");
    res.status(200).send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch site" });
  }
}
