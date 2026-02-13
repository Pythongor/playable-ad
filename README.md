# Phaser Playable Ad

A high-performance, strictly-typed boilerplate designed for creating **single-file** playable ads using **Phaser 3**, **Vite**, and **TypeScript**.

## 🎯 The Objective

The core of this project is a specialized build pipeline designed for the **AdTech industry**. Most ad networks (e.g., AppLovin, IronSource, Unity Ads) require playable ads to be delivered as a **single index.html file** where all assets (images, sounds, and code) are inlined.

This repository showcases a workflow that allows developers to:

1. Use modern **TypeScript** and **ESLint (Flat Config)** for robust development.
2. Maintain a modular architecture (Scenes, Classes, Plugins).
3. Compile the entire project into a **single, lightweight HTML file** optimized for ad network requirements.

## Key Features

- **Single-File Bundling:** Automated pipeline to inline all assets (via Base64 encoding) into one standalone HTML file.
- **Strict TypeScript Implementation:** Full type safety across Phaser scenes and custom third-party plugins.
- **Modern ESLint (v9+):** Enforces explicit type definitions and prevents "any" leaks, ensuring high-quality, maintainable code.

## Tech Stack

| Technology     | Purpose                                                |
| :------------- | :----------------------------------------------------- |
| **Phaser 3**   | Core game engine for high-performance 2D rendering.    |
| **TypeScript** | Strict typing for scalable and bug-free game logic.    |
| **Vite**       | Lightning-fast development server and bundling engine. |
| **ESLint**     | Modern Flat Config system for code quality and style.  |

## Asset Optimization

To maintain the "Single File" requirement while keeping file sizes low:

- All images are processed through Vite's asset pipeline.

- Small assets are automatically converted to Base64 URIs.

- Texture Atlases are used to reduce the number of individual image declarations.

## Asset Optimization

To maintain the "Single File" requirement while keeping file sizes low:

- All images are processed through Vite's asset pipeline.

- Small assets are automatically converted to Base64 URIs.

- Texture Atlases are used to reduce the number of individual image declarations.

## Installation & Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Development Server:**

   ```bash
    npm run dev
   ```

3. **Lint Project:**
   ```Bash
    npm run lint
   ```
4. **Build Single-File Ad:**
   ```Bash
    npm run build
   ```

The output will be generated in the /dist folder as a standalone HTML file.

## Showcase Game

The included "Bank Robber" mini-game serves as a technical demonstration of the framework's capabilities:

- **Dynamic Scaling**: Elements adjust based on custom getScale logic to fit any screen aspect ratio.

- **Gesture Control**: Smooth character swapping via the Swipe plugin integration.

- **Tween Animations**: High-quality feedback and "juice" using Phaser's internal tween engine.
