// Research Page Specific JavaScript

// Citation handling
document.addEventListener('DOMContentLoaded', function() {
    // Show/hide citation boxes
    const citeButtons = document.querySelectorAll('.btn-text');
    
    citeButtons.forEach(button => {
        if (button.textContent.includes('Cite')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const citationBox = button.closest('.publication').querySelector('.citation-box');
                if (citationBox) {
                    citationBox.style.display = citationBox.style.display === 'none' || !citationBox.style.display ? 'block' : 'none';
                }
            });
        }
    });
    
    // Copy citation functionality
    const copyButtons = document.querySelectorAll('.copy-citation');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const citation = button.previousElementSibling.textContent;
            
            try {
                await navigator.clipboard.writeText(citation);
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = '#2c5f2d';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                // Fallback for browsers without clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = citation;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy to Clipboard';
                }, 2000);
            }
        });
    });
});

// Benchmark table enhancements
const benchmarkTable = document.querySelector('.benchmark-table table');
if (benchmarkTable) {
    // Add row highlighting on hover
    const rows = benchmarkTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'rgba(26, 58, 71, 0.05)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
    
    // Add sorting functionality (simple implementation)
    const headers = benchmarkTable.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        if (index > 0 && index < headers.length - 1) { // Skip first (task) and last (dataset) columns
            header.style.cursor = 'pointer';
            header.title = 'Click to sort';
            
            header.addEventListener('click', () => {
                sortTable(index);
            });
        }
    });
}

function sortTable(columnIndex) {
    const table = document.querySelector('.benchmark-table table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Simple numeric sort for performance columns
    rows.sort((a, b) => {
        const aValue = parseFloat(a.cells[columnIndex].textContent.replace('%', '').replace('/', ''));
        const bValue = parseFloat(b.cells[columnIndex].textContent.replace('%', '').replace('/', ''));
        
        return bValue - aValue; // Descending order
    });
    
    // Remove existing rows and add sorted ones
    rows.forEach(row => tbody.removeChild(row));
    rows.forEach(row => tbody.appendChild(row));
    
    // Add visual feedback
    const header = table.querySelectorAll('th')[columnIndex];
    header.style.backgroundColor = 'rgba(26, 58, 71, 0.8)';
    setTimeout(() => {
        header.style.backgroundColor = '';
    }, 1000);
}

// Dataset download simulation
const datasetActions = document.querySelectorAll('.dataset-actions .btn-outline');

datasetActions.forEach(button => {
    if (button.textContent.includes('Download')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const originalText = button.textContent;
            button.textContent = 'Preparing...';
            button.disabled = true;
            
            // Simulate download preparation
            setTimeout(() => {
                alert('Dataset download would start here. Please sign up for access to download our research datasets.');
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    } else if (button.textContent.includes('Request Access')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../index.html#alpha-access';
        });
    }
});

// Collaboration card interactions
const collabCards = document.querySelectorAll('.collab-card');

collabCards.forEach(card => {
    card.addEventListener('click', () => {
        // Add pulse animation
        card.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    });
});

// Add pulse animation keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Lazy loading for heavy content
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            
            // If it's a table, animate the rows
            if (entry.target.querySelector('table')) {
                const rows = entry.target.querySelectorAll('tbody tr');
                rows.forEach((row, index) => {
                    setTimeout(() => {
                        row.style.opacity = '1';
                        row.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observe tables and heavy content sections
document.querySelectorAll('.benchmark-table, .dataset-grid, .methods-grid').forEach(section => {
    section.style.opacity = '0.3';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Research stats animation
const statsCards = document.querySelectorAll('.stat-card');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            const finalValue = statValue.textContent;
            
            // Animate counting for numeric values
            if (finalValue.includes('M+')) {
                animateValue(statValue, 0, 120, 2000, 'M+');
            } else if (finalValue.includes('%')) {
                animateValue(statValue, 0, parseFloat(finalValue), 2000, '%');
            } else if (!isNaN(parseInt(finalValue))) {
                animateValue(statValue, 0, parseInt(finalValue), 2000, '');
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statsCards.forEach(card => {
    statsObserver.observe(card);
});

function animateValue(element, start, end, duration, suffix = '') {
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 100; // Account for fixed navbar
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});