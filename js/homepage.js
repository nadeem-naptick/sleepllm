// Homepage Specific JavaScript

// Sleep Wave Canvas Animation
const canvas = document.getElementById('sleepWaveCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Wave parameters
    const waves = [
        { amplitude: 30, frequency: 0.015, speed: 0.02, color: 'rgba(26, 58, 71, 0.3)', offset: 0 },
        { amplitude: 25, frequency: 0.02, speed: 0.015, color: 'rgba(44, 95, 45, 0.3)', offset: 50 },
        { amplitude: 20, frequency: 0.025, speed: 0.025, color: 'rgba(212, 165, 116, 0.3)', offset: 100 }
    ];
    
    function drawWave(wave, yPosition) {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        
        for (let x = 0; x <= canvas.offsetWidth; x++) {
            const y = yPosition + Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= canvas.offsetWidth; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.offsetHeight);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= canvas.offsetHeight; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.offsetWidth, y);
            ctx.stroke();
        }
        
        // Draw waves
        waves.forEach((wave, index) => {
            const yPos = canvas.offsetHeight / 2 + wave.offset;
            drawWave(wave, yPos);
        });
        
        time += 1;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// Demo tabs functionality
const demoTabs = document.querySelectorAll('.demo-tabs .tab');
const tabPanes = document.querySelectorAll('.tab-pane');

demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active tab
        demoTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active pane
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === targetTab) {
                pane.classList.add('active');
            }
        });
    });
});

// Animated counters for statistics
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
        }
    };
    
    updateCounter();
};

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('M+')) {
                    animateCounter(stat, 120, 2000);
                } else if (text.includes('%')) {
                    animateCounter(stat, 94.2, 2000);
                } else if (text.includes('+')) {
                    animateCounter(stat, 100, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Simulated sleep stage visualization in demo
const stageDemo = document.querySelector('#staging');
if (stageDemo) {
    // Create animated bars for sleep stages
    const stages = stageDemo.querySelectorAll('.stage-stat');
    stages.forEach((stage, index) => {
        stage.style.opacity = '0';
        stage.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            stage.style.transition = 'all 0.5s ease';
            stage.style.opacity = '1';
            stage.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Alpha signup form enhancement
const alphaForm = document.getElementById('alphaSignup');
if (alphaForm) {
    alphaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(alphaForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.email || !data.institution || !data.role || !data.useCase) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show loading state
        const submitButton = alphaForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting Application...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success state
            submitButton.textContent = '✓ Application Submitted';
            submitButton.style.background = '#2c5f2d';
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <h3>Thank you for applying!</h3>
                <p>We've received your application for the Alpha Program. Our team will review it and get back to you within 5 business days.</p>
            `;
            successMessage.style.cssText = `
                background: #e8f5e9;
                color: #2c5f2d;
                padding: 2rem;
                border-radius: 8px;
                margin-top: 1rem;
                text-align: center;
            `;
            
            alphaForm.appendChild(successMessage);
            alphaForm.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 2000);
    });
}

// Interactive demo placeholder functionality
const demoContent = document.querySelector('.demo-content');
if (demoContent) {
    // Add placeholder interaction
    const waveformPreview = document.querySelector('.waveform-preview');
    if (waveformPreview) {
        waveformPreview.style.cursor = 'pointer';
        waveformPreview.addEventListener('click', () => {
            alert('Full interactive demo available with Alpha access. Request access below to try it with your own data!');
        });
    }
}

// Smooth reveal animations for sections
const revealElements = document.querySelectorAll('.hero-content, .section-intro, .tech-description');
revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, index * 200);
});