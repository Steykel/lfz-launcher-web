document.addEventListener('DOMContentLoaded', () => {
    // URL del repositorio de GitHub (Formato: usuario/repositorio)
    const repoPath = 'Steykel/LFZ-Launcher-Java'; 
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
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
