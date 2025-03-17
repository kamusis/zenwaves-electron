## init
```bash
npm create vite@latest zenwaves-electron --template vue
cd zenwaves-electron
npm install electron electron-store vue p5 lodash-es
npm install --save-dev vite-plugin-electron 
npm install --save-dev concurrently wait-on
```

## init structure
```
# ls

    Directory: C:\Users\kamus\OneDrive\Documents\zenwaves-electron

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
lar--            2025/3/9     1:11                .vscode
lar--            2025/3/9     1:23                node_modules
lar--            2025/3/9     1:11                public
lar--            2025/3/9     1:11                src
la---            2025/3/9     1:10            253 .gitignore
la---            2025/3/9     1:10            357 index.html
la---            2025/3/9     1:24            978 init-works.md
-a---            2025/3/9     1:23         100056 package-lock.json
-a---            2025/3/9     1:23            526 package.json
la---            2025/3/9     1:10            385 README.md
la---            2025/3/9     1:10            155 vite.config.js
```

## Designed Structure

```
zenwaves-electron/
├── src/                        # Vue.js application code
│   ├── assets/                 # Project assets
│   │   └── fonts/              # Font files
│   ├── components/             # Vue components
│   │   ├── blobs.js            # Blob animation helper
│   │   ├── config.js           # Configuration constants
│   │   ├── getRandomColor.js   # Color generation utility
│   │   ├── index.test.vue      # Component test file
│   │   ├── index.vue           # Main component
│   │   ├── loadPoem.js         # Poem loading service
│   │   ├── waves.js            # Wave animation logic
│   │   └── wavesColors.json    # Wave color configurations
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
│   ├── images/                 # Image resources
│   │   └── logo.png            # Application icon
│   └── scripts/                # Additional scripts
│       └── setWallpaper.cs     # Windows wallpaper setter
├── main/                       # Electron main process code
│   ├── main.js                 # Main process entry
│   └── preload.js              # Preload scripts
├── index.html                  # Entry HTML file
├── package.json                # Project configuration
├── package-lock.json           # Dependencies lock file
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── .gitignore                  # Git ignore rules with windsurfrules
└── README.md                   # Project documentation
```

## Default Installation Destination

### Linux
Application directory: `/opt/ZenWaves`
Configuration directory: `~/.config/ZenWaves`
Wallpaper directory: `~/.config/ZenWaves/wallpapers`

Main process: `/opt/ZenWaves/resources/app/main`
Renderer process: `/opt/ZenWaves/resources/app/dist/assets`
External scripts: `/opt/ZenWaves/resources/app/dist/scripts`

### macOS 
Application directory: `/Applications/ZenWaves.app`
Configuration directory: `~/Library/Application Support/ZenWaves`
Wallpaper directory: `~/Library/Application Support/ZenWaves/wallpapers`

### Windows 
Application directory: `C:\Program Files\ZenWaves`
Configuration directory: `C:\Users\{username}\AppData\Roaming\ZenWaves\`
Wallpaper directory: `C:\Users\{username}\AppData\Roaming\ZenWaves\wallpapers`
