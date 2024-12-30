<p align="center">
<img src="https://res.cloudinary.com/dpub6gcei/image/upload/v1678918299/GBstreams/branding/logo_full_by14nk.svg" alt="GBstreams Web Player" style="margin: 20px 0;">
</p>

<p align="center">
<a href="https://github.com/jellyfin/jellyfin-web">
<img alt="GPL 2.0 License" src="https://img.shields.io/github/license/jellyfin/jellyfin-web.svg"/>
</a>
<a href="https://opencollective.com/jellyfin">
<img alt="Donate" src="https://img.shields.io/opencollective/all/jellyfin.svg?label=backers"/>
</a>

<div align="center">
  <h1>GBstreams Web Player</h1>
  <p>Welcome to GBstreams Web Player! This repository is a fork of the remarkable open-source project, released under the copyleft GNU General Public License version 2.0 (GPL-2.0). Our mission is to bring the best of this project, blended in our creative additions. In this repository, you'll find a harmonious integration of our unique theme, logo, and features alongside the original codebases. Feel free to explore, make changes, and contribute back to the community. Please note that while our additions are under the same licenses as the originals, we kindly ask you to review the license details in each subdirectory to understand the terms and conditions.</p>
</div>

## Build Process

### Dependencies

- [Node.js](https://nodejs.org/en/download)
- npm (included in Node.js)

### Getting Started

1. Clone or download this repository.

   ```sh
   git clone https://github.com/KeyboardDabbler/gbs-webPlayer.git
   cd gbs-webPlayer
   ```

2. Install build dependencies in the project directory.

   ```sh
   npm install
   ```

3. Run the web client with webpack for local development.

   ```sh
   npm start
   ```

4. Build the client with sourcemaps available.

   ```sh
   npm run build:development
   ```

## Directory Structure

```
.
└── src
    ├── apps
    │   ├── dashboard     # Admin dashboard app layout and routes
    │   ├── experimental  # New experimental app layout and routes
    │   └── stable        # Classic (stable) app layout and routes
    ├── assets            # Static assets
    ├── components        # Higher order visual components and React components
    ├── controllers       # Legacy page views and controllers 🧹
    ├── elements          # Basic webcomponents and React wrappers 🧹
    ├── hooks             # Custom React hooks
    ├── lib               # Reusable libraries
    │   ├── globalize     # Custom localization library
    │   ├── legacy        # Polyfills for legacy browsers
    │   ├── navdrawer     # Navigation drawer library for classic layout
    │   └── scroller      # Content scrolling library
    ├── plugins           # Client plugins
    ├── scripts           # Random assortment of visual components and utilities 🐉
    ├── strings           # Translation files
    ├── styles            # Common app Sass stylesheets
    ├── themes            # CSS themes
    ├── types             # Common TypeScript interfaces/types
    └── utils             # Utility functions
```

- 🧹 &mdash; Needs cleanup
- 🐉 &mdash; Serious mess (Here be dragons)

## Contributing

You can help improve Jellyfin too! Check out our [Contribution Guide](https://jellyfin.org/docs/general/contributing/) to get started.

## Contributors ✨

Thanks goes to all wonderful people who contributed directly to Jellyfin and Jellyfin-Web.

