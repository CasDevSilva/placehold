# placeholdjs

> CLI tool to generate placeholder images locally with custom dimensions, colors, text and batch processing.

[![npm version](https://img.shields.io/npm/v/placeholdjs.svg)](https://www.npmjs.com/package/placeholdjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📐 **Custom Dimensions** - Generate images of any size
- 🎨 **Custom Colors** - Set background and text colors with hex values
- ✏️ **Custom Text** - Add custom text or auto-display dimensions
- 📦 **Batch Processing** - Generate multiple images at once
- 🖼️ **Multiple Formats** - PNG, JPG, WebP support
- 🔲 **Border Option** - Add borders to images
- ⚡ **Offline** - Works without internet connection

## Installation

```bash
npm install -g placeholdjs
```

## Usage

### Basic

```bash
# Generate 800x600 placeholder (saved to ~/.placehold/exports/)
placehold 800x600

# Specify output path
placehold 400x300 -o avatar.png

# Different format
placehold 1920x1080 -f jpg -o banner.jpg
```

### Custom Colors

```bash
# Custom background
placehold 500x500 -b "#3498db" -o blue.png

# Custom background and text color
placehold 800x600 -b "#2c3e50" -c "#ecf0f1" -o dark.png

# Using short hex
placehold 300x300 -b "#f00" -c "#fff" -o red.png
```

### Custom Text

```bash
# Custom text
placehold 800x400 -t "Hero Image" -o hero.png

# Custom text with font size
placehold 400x200 -t "Avatar" -s 24 -o avatar.png

# Auto font size (default)
placehold 1200x630 -t "Open Graph Image" -o og.png
```

### With Border

```bash
# Add border
placehold 300x300 --border -o bordered.png

# Border with colors
placehold 500x500 -b "#fff" --border -o card.png
```

### Batch Processing

```bash
# Generate 10 placeholders
placehold 400x300 --batch 10

# Batch with custom output directory
placehold 800x600 --batch 5 -o ./placeholders/

# Batch with styling
placehold 300x200 --batch 20 -b "#e74c3c" -f webp
```

## Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--output` | `-o` | Output file path | `~/.placehold/exports/` |
| `--format` | `-f` | Output format (png, jpg, webp) | `png` |
| `--background` | `-b` | Background color (hex) | `#CCCCCC` |
| `--color` | `-c` | Text color (hex) | `#666666` |
| `--text` | `-t` | Custom text to display | dimensions |
| `--fontsize` | `-s` | Font size (px) or "auto" | `auto` |
| `--border` | - | Add border to image | `false` |
| `--batch` | - | Number of images to generate | - |
| `--version` | `-v` | Show version | - |
| `--help` | `-h` | Show help | - |

## Output Directory

By default, images are saved to `~/.placehold/exports/`. Override with `-o`:

```bash
# Default directory
placehold 800x600
# Output: ~/.placehold/exports/hold-800x600-1703698800000.png

# Custom path
placehold 800x600 -o ./images/hero.png
# Output: ./images/hero.png

# Custom filename (in default directory)
placehold 800x600 -o myimage.png
# Output: ~/.placehold/exports/myimage.png
```

## Color Formats

Supports hex colors in multiple formats:

- `#RGB` → `#F00` (red)
- `#RRGGBB` → `#FF0000` (red)
- `#RGBA` → `#F00F` (red, full opacity)
- `#RRGGBBAA` → `#FF0000FF` (red, full opacity)

## Use Cases

### Web Development
```bash
# Product thumbnails
placehold 300x300 --batch 20 -o ./products/

# Hero banners
placehold 1920x600 -t "Hero Banner" -o hero.png

# Avatar placeholders
placehold 100x100 -b "#3498db" -c "#fff" -t "U" -o avatar.png
```

### Social Media
```bash
# Open Graph
placehold 1200x630 -t "OG Image" -o og.png

# Twitter Card
placehold 1200x600 -t "Twitter Card" -o twitter.png

# Instagram Post
placehold 1080x1080 -o instagram.png
```

### Prototyping
```bash
# Mobile screens
placehold 375x812 -t "iPhone" -o iphone.png
placehold 390x844 -t "iPhone 14" -o iphone14.png

# Desktop
placehold 1920x1080 -t "Desktop" -o desktop.png
```

## Why placeholdjs?

| Feature | placeholdjs | Online Services |
|---------|-------------|-----------------|
| Offline | ✅ | ❌ |
| No rate limits | ✅ | ❌ |
| Batch generation | ✅ | Limited |
| Custom fonts | ✅ | Limited |
| Privacy | ✅ Local | ❌ Server |
| Speed | ✅ Instant | Depends on network |

## License

MIT © [CasDevSilva](https://github.com/CasDevSilva)