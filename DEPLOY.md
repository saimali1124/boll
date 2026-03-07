# Deploy Bollywoodle to GitHub Pages

## 1. Set your GitHub username

Edit `package.json` and replace `YOUR_GITHUB_USERNAME` in the `homepage` field with your actual GitHub username, e.g.:

```json
"homepage": "https://gs-saim-ali.github.io/Boll"
```

(Use your repo name if it’s different from `Boll`.)

## 2. Install dependencies (including gh-pages)

```bash
npm install
```

## 3. Create the repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. Repository name: `Boll` (or whatever you want; update `homepage` in `package.json` to match).
3. Leave it empty (no README, .gitignore, or license).
4. Create the repository.

## 4. Push your code (first time)

From the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/Boll.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` and `Boll` with your username and repo name.

## 5. Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the app and pushes the `build` folder to the `gh-pages` branch. GitHub will serve it from:

**https://YOUR_GITHUB_USERNAME.github.io/Boll/**

## 6. Turn on GitHub Pages (if needed)

- Go to your repo → **Settings** → **Pages**.
- Under “Build and deployment”, **Source** should be **Deploy from a branch**.
- **Branch** should be `gh-pages` and folder `/ (root)`.
- Save. The site may take 1–2 minutes to appear.

---

**Later updates:** after changing code, run `npm run deploy` again and wait a minute for the site to update.
