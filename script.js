document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });
    });

    const skillsSection = document.querySelector('.skills');
    observer.observe(skillsSection);

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-menu a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // Web cursor effect
    const canvas = document.getElementById('cursorWeb');
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.hero');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Points for web effect
    let points = [];
    const numberOfPoints = 50;
    const connectionRadius = 150;
    let mouseX = 0;
    let mouseY = 0;

    // Point class
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = 2;
        }

        update() {
            // Move towards mouse slightly
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionRadius) {
                this.vx += dx * 0.002;
                this.vy += dy * 0.002;
            }

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Add friction
            this.vx *= 0.99;
            this.vy *= 0.99;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100, 255, 218, 0.8)';
            ctx.fill();
        }
    }

    // Create points
    function initPoints() {
        points = [];
        for (let i = 0; i < numberOfPoints; i++) {
            points.push(new Point(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    }

    // Draw connections between points
    function drawConnections() {
        points.forEach((point, i) => {
            points.slice(i + 1).forEach(otherPoint => {
                const dx = point.x - otherPoint.x;
                const dy = point.y - otherPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionRadius) {
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                    ctx.lineTo(otherPoint.x, otherPoint.y);
                    
                    // Calculate opacity based on distance
                    const opacity = 1 - (distance / connectionRadius);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.5})`;
                    ctx.lineWidth = opacity * 2;
                    ctx.stroke();
                }
            });
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw points
        points.forEach(point => {
            point.update();
            point.draw();
        });

        // Draw connections
        drawConnections();

        requestAnimationFrame(animate);
    }

    // Track mouse movement
    hero.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    // Handle mouse leaving
    hero.addEventListener('mouseleave', () => {
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
    });

    // Initialize and start animation
    initPoints();
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initPoints();
    });

    // Add touch support
    hero.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
    });

    // Scroll Progress Indicator
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight}`;

        const progressBar = document.querySelector('.scroll-progress');
        progressBar.style.transform = `scaleX(${scroll})`;
    });

    // Scroll to Top Button
    const scrollBtn = document.querySelector('.scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                alert('Message sent successfully!');
                this.reset(); // Reset the form
            } else {
                alert('Error sending message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
        });
    });
});
