
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('bento-grid');
    if (!container) return; 
    
    let products = {};
    try {
        const res = await fetch('/data/products.json');
        products = await res.json();
    } catch(err) {
        console.error("Failed to load products");
    }

    const path = window.location.pathname;
    const isMaterials = path.includes('materials.html');
    
    let displayKeys = [];
    if(isMaterials) {
        displayKeys = Object.keys(products).filter(k => products[k].group.startsWith('mat_'));
    } else {
        displayKeys = Object.keys(products).filter(k => !products[k].group.startsWith('mat_'));
    }

    const render = (filterGroup = 'all') => {
        container.innerHTML = '';
        let count = 0;
        displayKeys.forEach(key => {
            const p = products[key];
            if(filterGroup !== 'all' && p.group !== filterGroup) return;
            
            const el = document.createElement('div');
            if(count % 3 === 0) el.className = 'bento-card card-half';
            else el.className = 'bento-card card-third';
            
            el.innerHTML = `
                <div class="bento-info">
                    <div class="bento-eyebrow">${p.category}</div>
                    <h3 class="bento-title">${p.title}</h3>
                    <p class="bento-desc">${p.desc}</p>
                    <div class="bento-price">${p.price}</div>
                </div>
                <!-- Images framed softly at the bottom -->
                <div class="bento-img" style="background-image: url('${p.image}');"></div>
            `;
            el.onclick = () => window.location.href = `product.html?id=${key}`;
            container.appendChild(el);
            count++;
        });
    };
    
    render('all');

    const filterBtns = document.querySelectorAll('.filter-btn');
    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                render(e.target.getAttribute('data-filter'));
            });
        });
    }
});
