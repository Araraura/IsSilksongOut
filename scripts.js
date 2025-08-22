document.addEventListener("DOMContentLoaded", function() {

    (function () {
        class FireworksOverlay {
            constructor(options = {}) {
                this.canvas = document.createElement('canvas');
                this.ctx = this.canvas.getContext('2d');
                this.fireworks = [];
                this.running = false; // State to track if the animation is running
                this.defaults = {
                    colors: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F', '#581845'], // Default colors
                    particleCount: 50,
                    gravity: 0.02,
                    speed: { min: 2, max: 6 },
                    radius: { min: 1, max: 3 },
                    interval: 1000, // Fireworks interval in milliseconds
                    zIndex: 9999,
                    toggleButton: null, // Selector for a toggle button
                };
                this.settings = { ...this.defaults, ...options };
                this.init();
            }

            init() {
                this.setupCanvas();
                this.bindResize();
                this.bindToggleButton();
            }

            setupCanvas() {
                this.canvas.style.position = 'fixed';
                this.canvas.style.top = '0';
                this.canvas.style.left = '0';
                this.canvas.style.pointerEvents = 'none';
                this.canvas.style.zIndex = this.settings.zIndex;
                document.body.appendChild(this.canvas);
                this.resizeCanvas();
            }

            resizeCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }

            bindResize() {
                window.addEventListener('resize', () => this.resizeCanvas());
            }

            bindToggleButton() {
                if (this.settings.toggleButton) {
                    const button = document.querySelector(this.settings.toggleButton);
                    if (button) {
                        button.addEventListener('click', () => this.toggle());
                    }
                }
            }

            createFirework() {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height * 0.5;
                const colors = this.settings.colors;
                const particleCount = this.settings.particleCount;

                this.fireworks.push({
                    x,
                    y,
                    particles: Array.from({ length: particleCount }, () => ({
                        x,
                        y,
                        dx: Math.cos(Math.random() * Math.PI * 2) * (Math.random() * (this.settings.speed.max - this.settings.speed.min) + this.settings.speed.min),
                        dy: Math.sin(Math.random() * Math.PI * 2) * (Math.random() * (this.settings.speed.max - this.settings.speed.min) + this.settings.speed.min),
                        radius: Math.random() * (this.settings.radius.max - this.settings.radius.min) + this.settings.radius.min,
                        life: Math.random() * 80 + 50,
                        color: colors[Math.floor(Math.random() * colors.length)],
                    })),
                });
            }

            updateFireworks() {
                this.fireworks.forEach((firework, fireworkIndex) => {
                    firework.particles.forEach((particle, particleIndex) => {
                        particle.x += particle.dx;
                        particle.y += particle.dy;
                        particle.dy += this.settings.gravity;
                        particle.life--;

                        if (particle.life <= 0) {
                            firework.particles.splice(particleIndex, 1);
                        }
                    });

                    if (firework.particles.length === 0) {
                        this.fireworks.splice(fireworkIndex, 1);
                    }
                });
            }

            drawFireworks() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.fireworks.forEach((firework) => {
                    firework.particles.forEach((particle) => {
                        this.ctx.beginPath();
                        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                        this.ctx.fillStyle = particle.color;
                        this.ctx.fill();
                        this.ctx.closePath();
                    });
                });
            }

            startAnimation() {
                if (this.running) return;
                this.running = true;
                this.fireworksInterval = setInterval(() => this.createFirework(), this.settings.interval);

                const animate = () => {
                    if (!this.running) return;
                    this.updateFireworks();
                    this.drawFireworks();
                    this.animationFrame = requestAnimationFrame(animate);
                };
                animate();
            }

            stopAnimation() {
                this.running = false;
                clearInterval(this.fireworksInterval);
                cancelAnimationFrame(this.animationFrame);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            toggle() {
                this.running ? this.stopAnimation() : this.startAnimation();
            }

            destroy() {
                this.stopAnimation();
                this.canvas.remove();
                window.removeEventListener('resize', this.resizeCanvas);
            }
        }

        // Export function to global scope
        window.FireworksOverlay = FireworksOverlay;
    })();

    const fireworks = new FireworksOverlay({

        // an array of colors of the fireworks
        colors: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F', '#581845'],
        // the number of particles
        particleCount: 50,
        // simulated gravity affecting the particles
        gravity: 0.02,
        // animation speed
        speed: { min: 2, max: 6 },
        // radius range of particles
        radius: { min: 1, max: 3 },
        // animation interval in ms
        interval: 1000,
        // CSS z-index
        zIndex: 9999,
        // the selector of the trigger button
        toggleButton: null,
    });

    // Set the date we're counting down to in UTC
    var countDownDate = new Date(Date.UTC(2025, 8, 4, 14, 0, 0)).getTime()

    var releaseText = document.getElementById("releaseText");
    var releaseTime = document.getElementById("releaseTime");

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        releaseTime.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";


        // If the count down is over, alter text
        if (distance < 0) {
            clearInterval(x);

            releaseText.classList.remove("largeText", "no");
            releaseText.classList.add("veryLargeText", "yes");
            releaseText.innerHTML = "YES";

            releaseTime.innerHTML = "";

            fireworks.startAnimation();

        }
    }, 1000);

});