export function setupParticles() {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx || window.matchMedia('(pointer: coarse)').matches) {
        canvas.style.display = 'none';
        return;
    }

    let animationFrameId: number;
    let resizeTimeout: ReturnType<typeof setTimeout>;
    let particles: Particle[] = [];
    const particleCount = 100;
    const mouse = { x: null as number | null, y: null as number | null, radius: 200 };
    let isVisible = true;

    function setCanvasSize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class Particle {
        x: number; y: number; vx: number; vy: number; size: number; rotation: number; rotationSpeed: number;
        baseColor = 'rgba(234, 88, 12, 0.10)';

        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 3 + 3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        draw() {
            if (!ctx) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            const s = this.size;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(-s, s);
            ctx.lineTo(s, s);
            ctx.closePath();
            
            ctx.fillStyle = this.baseColor;
            ctx.fill();
            ctx.restore();
        }

        update() {
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
        }
    }

    function init() {
        setCanvasSize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        if (mouse.x === null || !ctx) return;

        for (let a = 0; a < particles.length; a++) {
            const dxMouse = mouse.x - particles[a].x;
            const dyMouse = mouse.y - particles[a].y;
            const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distanceMouse < mouse.radius) {
                const opacity = 1 - (distanceMouse / mouse.radius);
                ctx.strokeStyle = `rgba(234, 88, 12, ${opacity * 0.25})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(particles[a].x, particles[a].y);
                ctx.stroke();
            }
        }
    }

    function animate() {
        if (!ctx || !isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        animationFrameId = requestAnimationFrame(animate);
    }

    // Intersection Observer to pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                animate();
            } else {
                cancelAnimationFrame(animationFrameId);
            }
        });
    });
    observer.observe(canvas);

    // Event Listeners
    const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            init();
        }, 250);
    };

    const onMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    const onMouseOut = () => {
        mouse.x = null;
        mouse.y = null;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);

    // Initial start
    init();
    animate();

    // Cleanup function
    return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseout', onMouseOut);
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
    };
}
