<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# chromamatch 🎯

## Basic Details

### Team Name: newstep

### Team Members
- Member 1: Hannath - pptm arts and science college
- Member 2: Jafna - pptm arts and science college
- Member 3: Rinsy sharin - pptm arts and science college

### Hosted Project Link
https://jafnak05-stack.github.io/tink-her-hack-temp/

### Project Description
This project, ChromaMatch, is an AI-powered tool that captures, detects, and matches colors from any image instantly. It helps designers and creatives generate accurate color palettes in seconds. Users can upload an image or use their camera to quickly extract matching color combinations and specific color codes (HEX/RGB) for their projects.

### The Problem statement
Designers often struggle with manually identifying and matching exact colors from real-world objects or images, which can be time-consuming and inaccurate.

### The Solution
We solve it using browser-based image processing. The system analyzes uploaded or captured images, detects key colors using algorithm-based quantization, and automatically generates accurate color codes and matching palettes instantly. It also allows for precision pixel selection to get the exact color of any point in an image.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: HTML5, CSS3, JavaScript (Vanilla)
- Frameworks used: None (Pure Vanilla JS for performance)
- Libraries used: FontAwesome 6.4.0 (Icons), Google Fonts (Poppins)
- Tools used: VS Code, Git, GitHub Pages

**For Hardware:**
- Main components: N/A (Software-only project)
- Specifications: N/A
- Tools required: Device with a Camera (for Capture feature)

---

## Features

List the key features of your project:
- **Camera Capture**: Real-time color capture using the device camera.
- **Image Picker**: Upload images from the local device for analysis.
- **Palette Generator**: Automatically extracts the top 5 dominant colors from any image.
- **Precision Detection**: Interactive eye-dropper tool to pick the exact color of any pixel.
- **Color Codes**: Instant display of HEX and RGB values for all generated colors.
- **Save Favorites**: Save generated palettes to Local Storage for future reference.
- **Copy to Clipboard**: One-click copying of color codes to the clipboard.

---

## Implementation

### For Software:

#### Installation
```bash
# Clone the repository
git clone https://github.com/jafnak05-stack/tink-her-hack-temp.git

# Navigate to the project directory
cd tink-her-hack-temp
```

#### Run
```bash
# Open index.html in your preferred web browser
# OR for a better experience, use a local development server like Live Server or:
npx serve .
```

### For Hardware:

#### Components Required
N/A - This is a web application.

#### Circuit Setup
N/A

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

!https://github.com/jafnak05-stack/tink-her-hack-temp/blob/main/frontpage.png
ChromaMatch is an AI-powered tool that captures, detects, and matches colors from any image instantly. It helps designers generate accurate color palettes and extract exact color codes quickly and easily.

![Palette Generator](docs/palette_screenshot.png)
*The Palette Generator automatically extracts dominant colors and provides HEX/RGB codes.*

![Camera Capture](docs/camera_screenshot.png)
*The Camera Capture feature allows users to snap photos in real-time for color analysis.*

#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
*The app uses a client-side architecture where the browser handles all image processing and storage (Local Storage), ensuring fast performance and privacy.*

**Application Workflow:**

![Workflow](docs/workflow.png)
*User uploads/captures image -> Image processed on Canvas -> Colors Extracted -> Palette Generated -> User saves or copies codes.*

---

### For Hardware:

#### Schematic & Circuit
N/A

#### Build Photos
N/A

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation
N/A - This project runs entirely on the client side and does not currently use a backend API.

---

### For Mobile Apps:
N/A

---

### For Hardware Projects:
N/A

---

### For Scripts/CLI Tools:
N/A

---

## Project Demo

### Video
[Add your demo video link here - YouTube, Google Drive, etc.]

*Explain what the video demonstrates - key features, user flow, technical highlights*

### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:

**Tool Used:** [e.g., ChatGPT, GitHub Copilot]

**Purpose:** [What you used it for]
- Example: "Refining the color extraction algorithm logic"
- Example: "Generating initial CSS for responsive layout"

**Key Prompts Used:**
- "How to extract dominant colors from an image using HTML5 Canvas"
- "Implement a copy-to-clipboard function in JavaScript"

**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation (color quantization)
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- Hannath: [Specific contributions - e.g., UI/UX Design, Frontend Layout]
- Jafna: [Specific contributions - e.g., Logic Implementation, JS Functionality]
- Rinsy sharin: [Specific contributions - e.g., Documentation, Testing]

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ at TinkerHub
