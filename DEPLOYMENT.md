# GitHub Pages Deployment Guide

## Step-by-Step Instructions

### Step 1: Install gh-pages package
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json
The package.json has been updated with:
- `homepage` field (you need to replace YOUR_USERNAME with your GitHub username)
- `predeploy` and `deploy` scripts

**IMPORTANT**: Replace `YOUR_USERNAME` in package.json with your actual GitHub username!

### Step 3: Initialize Git Repository (if not already done)
```bash
git init
```

### Step 4: Add all files to Git
```bash
git add .
```

### Step 5: Make your first commit
```bash
git commit -m "Initial commit: Bollywoodle game"
```

### Step 6: Create a new repository on GitHub
1. Go to https://github.com/new
2. Repository name: `Boll` (or any name you prefer)
3. Make it **Public** (required for free GitHub Pages)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 7: Connect your local repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/Boll.git
```
(Replace YOUR_USERNAME with your GitHub username)

### Step 8: Push your code to GitHub
```bash
git branch -M main
git push -u origin main
```

### Step 9: Update homepage in package.json
Edit `package.json` and replace `YOUR_USERNAME` with your actual GitHub username:
```json
"homepage": "https://YOUR_USERNAME.github.io/Boll"
```

### Step 10: Deploy to GitHub Pages
```bash
npm run deploy
```

This will:
- Build your React app
- Create a `gh-pages` branch
- Push it to GitHub
- Make your app available at: `https://YOUR_USERNAME.github.io/Boll`

### Step 11: Enable GitHub Pages (if needed)
1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under "Source", select **gh-pages branch**
5. Click **Save**

### Step 12: Access your deployed app
Your app will be live at:
```
https://YOUR_USERNAME.github.io/Boll
```

## Updating Your Deployment

Whenever you make changes and want to update the live site:

```bash
git add .
git commit -m "Your commit message"
git push
npm run deploy
```

## Troubleshooting

- If the site shows a blank page, check the browser console for errors
- Make sure the `homepage` field in package.json matches your repository name
- Wait a few minutes after deployment for GitHub Pages to update
- Clear your browser cache if you see old content



