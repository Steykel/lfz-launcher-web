document.addEventListener('DOMContentLoaded', () => {
    // URL del repositorio de GitHub (Formato: usuario/repositorio)
    const repoPath = 'Steykel/LFZ-Launcher-Descargas'; 
    const apiUrl = `https://api.github.com/repos/${repoPath}/releases/latest`;

    // Detectar Sistema Operativo
    const platform = window.navigator.platform.toLowerCase();
    const isWindows = platform.indexOf('win') > -1;

    // Elementos del DOM
    const versionLabel = document.getElementById('latest-version');
    const btnHeroDownload = document.getElementById('btn-hero-download');
    const btnFinalDownload = document.getElementById('btn-final-download');

    // Cambiar texto de los botones si no es Windows
    if (!isWindows) {
        btnHeroDownload.innerHTML = '<i class="ph-bold ph-warning"></i> Descargar (Solo Windows)';
        btnFinalDownload.innerHTML = '<i class="ph-bold ph-warning"></i> Descargar (Solo Windows)';
    }

    // Obtener la última versión desde GitHub Releases
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar la versión');
            return response.json();
        })
        .then(data => {
            const versionName = data.name || data.tag_name;
            versionLabel.textContent = versionName;
            versionLabel.style.color = 'var(--primary)';
            
            // Buscar el archivo .exe en los assets del release
            const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
            
            if (exeAsset) {
                // Actualizar los enlaces de descarga
                btnHeroDownload.href = exeAsset.browser_download_url;
                btnFinalDownload.href = exeAsset.browser_download_url;
                
                // Efecto visual de que está listo
                btnHeroDownload.style.boxShadow = '0 0 20px rgba(255, 51, 102, 0.4)';
            }
        })
        .catch(error => {
            console.error('Error obteniendo release de GitHub:', error);
            versionLabel.textContent = 'v1.3.6 (Manual)';
        });

    // Efecto simple de scroll suave (Smooth Scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Si el href cambió a una URL (como el botón de descarga), no interceptar
            if (!href.startsWith('#')) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Animación de Partículas de Fondo ---
    const canvas = document.getElementById('particles-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                // Colores rojos/naranjas para que combine con el diseño
                const colors = ['rgba(255, 51, 102, 0.5)', 'rgba(255, 112, 67, 0.4)', 'rgba(255, 255, 255, 0.1)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Crear partículas (ajustar cantidad según el tamaño de pantalla)
        const particleCount = Math.min(100, Math.floor(width / 15));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Conectar partículas cercanas con una línea sutil
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 51, 102, ${0.1 - distance/1200})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
});
