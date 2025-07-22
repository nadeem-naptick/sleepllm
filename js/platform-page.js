// Platform Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // API Tab switching
    const apiTabs = document.querySelectorAll('.api-section .tab');
    const apiPanes = document.querySelectorAll('.api-section .tab-pane');
    
    apiTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            // Update tabs
            apiTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panes
            apiPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === target) {
                    pane.classList.add('active');
                }
            });
        });
    });
    
    // Integration tabs
    const intTabs = document.querySelectorAll('.int-tab');
    const intPanes = document.querySelectorAll('.int-pane');
    
    intTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            intTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            intPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === target) {
                    pane.classList.add('active');
                }
            });
        });
    });
    
    // Performance meter animation
    const performanceSection = document.querySelector('.performance-section');
    if (performanceSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate meter fill
                    const meterFill = entry.target.querySelector('.meter-fill');
                    if (meterFill) {
                        setTimeout(() => {
                            meterFill.style.width = '85%';
                        }, 500);
                    }
                    
                    // Animate chart bars
                    const chartBars = entry.target.querySelectorAll('.chart-bar');
                    chartBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transform = 'scaleY(1)';
                        }, index * 200);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(performanceSection);
    }
    
    // Code block copy functionality
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = 'Copy';
        copyButton.className = 'copy-code-btn';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 4px 8px;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
        `;
        
        block.style.position = 'relative';
        block.appendChild(copyButton);
        
        copyButton.addEventListener('click', async () => {
            const code = block.querySelector('code').textContent;
            try {
                await navigator.clipboard.writeText(code);
                copyButton.innerHTML = 'Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        });
    });
    
    // Architecture component hover effects
    const archComponents = document.querySelectorAll('.arch-component');
    archComponents.forEach(component => {
        component.addEventListener('mouseenter', () => {
            component.style.transform = 'translateY(-4px)';
            component.style.boxShadow = '0 10px 25px rgba(26, 58, 71, 0.15)';
        });
        
        component.addEventListener('mouseleave', () => {
            component.style.transform = 'translateY(0)';
            component.style.boxShadow = '';
        });
    });
});

// Initialize chart bars with scale 0 for animation
const chartBars = document.querySelectorAll('.chart-bar');
chartBars.forEach(bar => {
    bar.style.transform = 'scaleY(0)';
    bar.style.transformOrigin = 'bottom';
    bar.style.transition = 'transform 0.5s ease';
});