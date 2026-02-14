document.addEventListener('DOMContentLoaded', () => {
    /* ------------------------------------------------------------
       Variables & Elements
       ------------------------------------------------------------ */
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Feature Buttons
    const btnCamera = document.getElementById('btn-camera');
    const btnUpload = document.getElementById('btn-upload');
    const btnHeroUpload = document.getElementById('btn-hero-upload');
    const btnPalette = document.getElementById('btn-palette');
    const btnCodes = document.getElementById('btn-codes');
    const btnSave = document.getElementById('btn-save');
    const btnStartNow = document.getElementById('btn-start-now');

    // Precision Detection
    const btnPrecision = document.getElementById('btn-precision');
    const pickedColorContainer = document.getElementById('picked-color-container');
    const pickedColorDisplay = document.getElementById('picked-color-display');
    const pickedColorCode = document.getElementById('picked-color-code');

    const fileInput = document.getElementById('file-input');

    // Workspace Elements
    const workspaceSection = document.getElementById('workspace');
    const sourceImage = document.getElementById('source-image');
    const noImagePlaceholder = document.getElementById('no-image-placeholder');
    const generatedPaletteContainer = document.getElementById('generated-palette');
    const actionSavePalette = document.getElementById('action-save-palette');
    const favoritesContainer = document.getElementById('favorites-container');

    // Camera Modal Elements
    const cameraModal = document.getElementById('camera-modal');
    const closeModal = document.querySelector('.close-modal');
    const cameraFeed = document.getElementById('camera-feed');
    const cameraCanvas = document.getElementById('camera-canvas');
    const captureBtn = document.getElementById('capture-btn');

    let cameraStream = null;
    let currentPalette = []; // Stores current generated colors
    let isPickingMode = false;

    /* ------------------------------------------------------------
       Initialization
       ------------------------------------------------------------ */
    loadFavorites();

    /* ------------------------------------------------------------
       Navbar & Mobile Menu
       ------------------------------------------------------------ */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    /* ------------------------------------------------------------
       Smooth Animation Observer
       ------------------------------------------------------------ */
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.card, .hero-content, .section-title, .step-item, .module-detailed-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    document.addEventListener('transitionend', (e) => {
        if (e.target.classList.contains('animate-up')) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .animate-up { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(styleSheet);


    // Start Now Button Logic
    if (btnStartNow) {
        btnStartNow.addEventListener('click', () => {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ------------------------------------------------------------
       Feature 1: Image Picker
       ------------------------------------------------------------ */
    if (btnUpload) {
        btnUpload.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (btnHeroUpload) {
        btnHeroUpload.addEventListener('click', () => {
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                displayImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    /* ------------------------------------------------------------
       Feature 2: Camera Capture
       ------------------------------------------------------------ */
    if (btnCamera) {
        btnCamera.addEventListener('click', async () => {
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                cameraFeed.srcObject = cameraStream;
                cameraModal.classList.remove('hidden');
                setTimeout(() => cameraModal.classList.add('active'), 10); // Fade in
            } catch (err) {
                alert('Cannot access camera. Please allow permissions.');
                console.error(err);
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', stopCamera);
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === cameraModal) stopCamera();
    });

    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            const context = cameraCanvas.getContext('2d');
            cameraCanvas.width = cameraFeed.videoWidth;
            cameraCanvas.height = cameraFeed.videoHeight;
            context.drawImage(cameraFeed, 0, 0, cameraCanvas.width, cameraCanvas.height);

            const imageDataUrl = cameraCanvas.toDataURL('image/png');
            stopCamera();
            displayImage(imageDataUrl);
        });
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        cameraModal.classList.remove('active');
        setTimeout(() => cameraModal.classList.add('hidden'), 300);
    }

    /* ------------------------------------------------------------
       Core Logic: Display Image & Process Colors
       ------------------------------------------------------------ */
    function displayImage(src) {
        sourceImage.src = src;
        sourceImage.style.display = 'block';
        noImagePlaceholder.style.display = 'none';

        // Reset picking mode
        isPickingMode = false;
        sourceImage.style.cursor = 'default';
        if (pickedColorContainer) pickedColorContainer.classList.add('hidden');

        // Show workspace and scroll to it
        workspaceSection.classList.remove('hidden');
        workspaceSection.scrollIntoView({ behavior: 'smooth' });

        // Auto-generate palette
        // Need to wait for image to load to extract colors
        if (sourceImage.complete) {
            extractColors(sourceImage);
        } else {
            sourceImage.onload = () => {
                extractColors(sourceImage);
            };
        }
    }

    /* ------------------------------------------------------------
       Feature 3 & 5: Palette Generation & Color Codes
       ------------------------------------------------------------ */
    if (btnPalette) {
        btnPalette.addEventListener('click', () => {
            if (sourceImage.src && sourceImage.style.display !== 'none') {
                workspaceSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Please capture or upload an image first.');
            }
        });
    }

    if (btnCodes) {
        btnCodes.addEventListener('click', () => {
            if (sourceImage.src && sourceImage.style.display !== 'none') {
                workspaceSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Please capture or upload an image first to see color codes.');
            }
        });
    }

    function extractColors(imgElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        ctx.drawImage(imgElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorCount = {};

        // Simple quantization: sample every 10th pixel for performance
        // increased step for performance on large images
        for (let i = 0; i < imageData.length; i += 40) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a < 128) continue; // Skip transparent

            const hex = rgbToHex(r, g, b);
            colorCount[hex] = (colorCount[hex] || 0) + 1;
        }

        // Sort by frequency
        const sortedColors = Object.keys(colorCount).sort((a, b) => colorCount[b] - colorCount[a]);

        // Pick top 5
        currentPalette = sortedColors.slice(0, 5);

        // If less than 5, fill with duplicates or white
        while (currentPalette.length < 5) {
            currentPalette.push('#ffffff');
        }

        renderPalette(currentPalette);
    }

    function renderPalette(colors) {
        generatedPaletteContainer.innerHTML = '';

        colors.forEach(color => {
            const rgb = hexToRgb(color);
            const item = document.createElement('div');
            item.className = 'palette-item';
            item.innerHTML = `
                <div class="color-box" style="background-color: ${color};"></div>
                <div class="color-codes">
                    <div class="code-row">
                        <span>HEX: <strong>${color}</strong></span>
                        <button class="copy-btn" onclick="copyToClipboard('${color}')"><i class="fa-regular fa-copy"></i></button>
                    </div>
                    <div class="code-row">
                        <span>RGB: <strong>${rgb.r}, ${rgb.g}, ${rgb.b}</strong></span>
                        <button class="copy-btn" onclick="copyToClipboard('rgb(${rgb.r}, ${rgb.g}, ${rgb.b})')"><i class="fa-regular fa-copy"></i></button>
                    </div>
                </div>
            `;
            generatedPaletteContainer.appendChild(item);
        });
    }

    /* ------------------------------------------------------------
       Feature 4: Save Favorites
       ------------------------------------------------------------ */
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            // Scroll to favorites
            document.getElementById('palette-preview').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (actionSavePalette) {
        actionSavePalette.addEventListener('click', () => {
            if (!currentPalette || currentPalette.length === 0) return;

            const favorites = getFavorites();
            const newPalette = {
                id: Date.now(),
                colors: currentPalette,
                date: new Date().toLocaleDateString()
            };

            favorites.unshift(newPalette);
            localStorage.setItem('chromaMatchFavorites', JSON.stringify(favorites));

            loadFavorites();
            alert('Palette saved to favorites!');
        });
    }

    function getFavorites() {
        const stored = localStorage.getItem('chromaMatchFavorites');
        return stored ? JSON.parse(stored) : [];
    }

    function loadFavorites() {
        const favorites = getFavorites();
        if (!favoritesContainer) return;

        favoritesContainer.innerHTML = '';

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p class="placeholder-text" style="grid-column: 1/-1; text-align: center;">No favorites saved yet.</p>';
            return;
        }

        favorites.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'palette-card';

            let stripesHtml = '';
            // Show first 3 colors as preview
            fav.colors.slice(0, 3).forEach(color => {
                stripesHtml += `<div class="color-stripe" style="background: ${color};"></div>`;
            });

            card.innerHTML = `
                <button class="delete-fav" onclick="deleteFavorite(${fav.id})"><i class="fa-solid fa-trash"></i></button>
                ${stripesHtml}
                <div class="palette-info">
                    <span>Palette</span>
                    <small>${fav.colors[0]} • ${fav.colors[1]}</small>
                </div>
            `;
            favoritesContainer.appendChild(card);
        });
    }

    // Precision Detection Logic
    if (btnPrecision) {
        btnPrecision.addEventListener('click', () => {
            if (sourceImage.src && sourceImage.style.display !== 'none') {
                workspaceSection.scrollIntoView({ behavior: 'smooth' });
                sourceImage.style.cursor = 'crosshair';
                alert('Precision Mode Active: Click anywhere on the image to pick a color.');
            } else {
                alert('Please capture or upload an image first.');
            }
        });
    }

    sourceImage.addEventListener('click', (e) => {
        // Create canvas to read pixel data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = sourceImage.naturalWidth;
        canvas.height = sourceImage.naturalHeight;
        ctx.drawImage(sourceImage, 0, 0);

        // Calculate click position relative to image
        const rect = sourceImage.getBoundingClientRect();
        const scaleX = sourceImage.naturalWidth / rect.width;
        const scaleY = sourceImage.naturalHeight / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Get pixel data
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };

        // Show result
        if (pickedColorContainer) {
            pickedColorContainer.classList.remove('hidden');
            pickedColorDisplay.style.backgroundColor = hex;
            pickedColorCode.innerHTML = `
                <span>HEX: ${hex}</span> <button class="copy-btn" onclick="copyToClipboard('${hex}')"><i class="fa-regular fa-copy"></i></button><br>
                <span>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</span> <button class="copy-btn" onclick="copyToClipboard('rgb(${rgb.r}, ${rgb.g}, ${rgb.b})')"><i class="fa-regular fa-copy"></i></button>
            `;
        }
    });

    /* ------------------------------------------------------------
       Helpers & Global Functions
       ------------------------------------------------------------ */

    // Expose delete function to window so onclick works
    window.deleteFavorite = function (id) {
        if (confirm('Delete this palette?')) {
            let favorites = getFavorites();
            favorites = favorites.filter(f => f.id !== id);
            localStorage.setItem('chromaMatchFavorites', JSON.stringify(favorites));
            loadFavorites();
        }
    };

    window.copyToClipboard = function (text) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.activeElement; // The button that was clicked
            if (btn && btn.classList.contains('copy-btn')) {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(() => btn.innerHTML = originalHtml, 1500);
            }
        });
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.substring(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }
});
