(() => {
    const canvas = document.getElementById('universe');
    const ctx = canvas.getContext('2d');
    const speedControl = document.getElementById('speed');
    const zoomControl = document.getElementById('zoom');
    const orbitToggle = document.getElementById('show-orbits');
    const namesToggle = document.getElementById('show-names');
    const trailToggle = document.getElementById('show-trails');
    const toggleButton = document.getElementById('toggle');
    const resetButton = document.getElementById('reset');
    const infoBox = document.getElementById('info');

    const planetsData = JSON.parse(document.getElementById('planet-data').textContent);
    const BASE_SPEED = window.BASE_SPEED || 60; // dias por segundo

    let running = true;
    let zoom = parseFloat(zoomControl.value);
    let speedMultiplier = parseFloat(speedControl.value);
    let lastTimestamp = performance.now();
    let selected = null;

    const maxOrbit = Math.max(...planetsData.map((p) => p.orbit_radius));
    const trails = new Map();
    const stars = Array.from({ length: 120 }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.4,
    }));

    const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    function angleIncrement(periodDays, deltaDays) {
        return (2 * Math.PI * deltaDays) / periodDays;
    }

    const planets = planetsData.map((planet) => ({
        ...planet,
        angle: Math.random() * Math.PI * 2,
    }));

    function reset() {
        planets.forEach((p) => {
            p.angle = Math.random() * Math.PI * 2;
        });
        trails.clear();
        selected = null;
        updateInfoBox();
    }

    function drawBackground() {
        const { width, height } = canvas;
        const gradient = ctx.createRadialGradient(width * 0.3, height * 0.3, 0, width * 0.5, height * 0.5, width * 0.65);
        gradient.addColorStop(0, '#0c1220');
        gradient.addColorStop(1, '#050812');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // pequenas estrelas
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        stars.forEach((star) => {
            ctx.fillRect(star.x * width, star.y * height, star.size, star.size);
        });
    }

    function drawOrbits(scale) {
        if (!orbitToggle.checked) return;
        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        planets.forEach((planet) => {
            ctx.beginPath();
            ctx.ellipse(cx, cy, planet.orbit_radius * scale, planet.orbit_radius * scale, 0, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    function drawTrails(scale) {
        if (!trailToggle.checked) return;
        trails.forEach((points, name) => {
            if (points.length < 3) return;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(90, 209, 255, 0.35)';
            ctx.lineWidth = 1.4;
            points.forEach((pt, idx) => {
                const [x, y] = pt;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });
    }

    function drawPlanets(scale) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        planets.forEach((planet) => {
            const x = cx + Math.cos(planet.angle) * planet.orbit_radius * scale;
            const y = cy + Math.sin(planet.angle) * planet.orbit_radius * scale;

            // trilha
            if (!trails.has(planet.name)) trails.set(planet.name, []);
            const path = trails.get(planet.name);
            if (running || path.length === 0) {
                path.push([x, y]);
                if (path.length > 200) path.shift();
            }

            const radius = Math.max(4, Math.cbrt(planet.radius));
            const gradient = ctx.createRadialGradient(x - radius / 2, y - radius / 2, 0, x, y, radius * 1.4);
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(0.35, planet.color);
            gradient.addColorStop(1, '#111');

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            if (namesToggle.checked) {
                ctx.fillStyle = '#e7ecff';
                ctx.font = '12px Inter, sans-serif';
                ctx.fillText(planet.name, x + radius + 4, y - radius - 2);
            }

            if (selected === planet.name) {
                ctx.strokeStyle = '#5ad1ff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }

    function drawSun(scale) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 24 * Math.max(1, zoom * 0.6);
        const gradient = ctx.createRadialGradient(cx - radius / 2, cy - radius / 2, radius * 0.2, cx, cy, radius * 1.2);
        gradient.addColorStop(0, '#fff6c3');
        gradient.addColorStop(0.5, '#f7d84b');
        gradient.addColorStop(1, 'rgba(247, 216, 75, 0.08)');
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function updateAngles(deltaDays) {
        planets.forEach((planet) => {
            planet.angle += angleIncrement(planet.orbital_period_days, deltaDays);
        });
    }

    function updateInfoBox() {
        if (!selected) {
            infoBox.innerHTML = '<h2>Dados do corpo celeste</h2><p>Selecione um planeta na visualização para detalhes.</p>';
            return;
        }
        const planet = planets.find((p) => p.name === selected);
        infoBox.innerHTML = `
            <h2>${planet.name}</h2>
            <p><strong>Raio equatorial:</strong> ${planet.radius.toLocaleString('pt-BR')} mil km</p>
            <p><strong>Raio orbital médio:</strong> ${planet.orbit_radius.toLocaleString('pt-BR')} milhões de km</p>
            <p><strong>Período orbital:</strong> ${planet.orbital_period_days.toLocaleString('pt-BR')} dias</p>
        `;
    }

    function drawFrame(deltaMs) {
        const deltaDays = (deltaMs / 1000) * BASE_SPEED * speedMultiplier;
        if (running) updateAngles(deltaDays);

        const scale = ((Math.min(canvas.width, canvas.height) / 2) - 50) / maxOrbit * zoom;

        drawBackground();
        drawOrbits(scale);
        drawTrails(scale);
        drawSun(scale);
        drawPlanets(scale);
    }

    function onClick(event) {
        const rect = canvas.getBoundingClientRect();
        const xClick = event.clientX - rect.left;
        const yClick = event.clientY - rect.top;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const scale = ((Math.min(canvas.width, canvas.height) / 2) - 50) / maxOrbit * zoom;
        let found = null;
        planets.forEach((planet) => {
            const x = cx + Math.cos(planet.angle) * planet.orbit_radius * scale;
            const y = cy + Math.sin(planet.angle) * planet.orbit_radius * scale;
            const radius = Math.max(4, Math.cbrt(planet.radius));
            const dx = x - xClick;
            const dy = y - yClick;
            if (Math.hypot(dx, dy) <= radius + 6) {
                found = planet.name;
            }
        });
        selected = found;
        updateInfoBox();
    }

    function loop(timestamp) {
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        drawFrame(delta);
        requestAnimationFrame(loop);
    }

    canvas.addEventListener('click', onClick);
    speedControl.addEventListener('input', () => {
        speedMultiplier = parseFloat(speedControl.value);
    });
    zoomControl.addEventListener('input', () => {
        zoom = parseFloat(zoomControl.value);
    });
    toggleButton.addEventListener('click', () => {
        running = !running;
        toggleButton.textContent = running ? '⏸️ Pausar' : '▶️ Retomar';
    });
    resetButton.addEventListener('click', reset);

    updateInfoBox();
    requestAnimationFrame(loop);
})();
