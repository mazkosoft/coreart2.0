window.addEventListener('DOMContentLoaded', () => {
    // 应用全局背景
    if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.backgroundUrl) {
        document.body.style.backgroundImage = `url('${SITE_CONFIG.backgroundUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    // 渲染组件
    renderHeader();
    // 获取当前页面标识，默认为 'index'
    const activePage = window.ACTIVE_PAGE || 'index';
    renderNav(activePage); 
    renderFooter();
    
    // 渲染首页面板
    if (activePage === 'index') {
        const layout = (typeof LAYOUT_CONFIG !== 'undefined' && LAYOUT_CONFIG.home) ? LAYOUT_CONFIG.home : {
            showMarquee: true, showSlider: true, showNews: true, showAbout: true, showStats: true, showJoin: true, showFollow: true
        };

        if(layout.showMarquee) renderMarquee('marquee-container');
        if(layout.showSlider) {
            renderHomeSlider('home-slider');
            initHomeSlider();
        }
        if(layout.showNews) renderNewsPanel('news-panel');
        if(layout.showAbout) renderAboutPanel('about-panel');
        if(layout.showStats) renderStatsPanel('stats-panel');
        if(layout.showJoin) renderJoinPanel('join-panel');
        if(layout.showFollow) renderFollowPanel('follow-panel');
    } else if (activePage === 'videos') {
        renderVideosPage('videos-list-container');
    } else if (activePage === 'musics') {
        renderMusicsPage('music-playlist-container');
    } else if (activePage === 'articles') {
        renderArticlesPage('articles-list-container');
    }
    renderModals();
    
    // 初始化图标
    if (window.lucide) {
        lucide.createIcons();
    }
});

// --- 首页轮播图 ---
function initHomeSlider() {
    const container = document.getElementById('home-slider');
    if (!container) return;

    // 使用 data.js 中的 SLIDES_DATA
    const slides = typeof SLIDES_DATA !== 'undefined' ? SLIDES_DATA : [];
    
    let currentIndex = 0;

    function renderSlides() {
        container.innerHTML = slides.map((slide, idx) => `
            <div class="absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}">
                <img class="w-full h-full object-cover opacity-90" src="${slide.url}" alt="Slide">
                <div class="absolute inset-0 bg-gradient-to-t from-[#002244] via-transparent to-transparent"></div>
            </div>
        `).join('') + `
            <div class="absolute bottom-0 left-0 right-0 p-10 flex flex-col items-start justify-end pointer-events-none">
                <div class="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[10px] text-white font-black uppercase tracking-[0.2em] mb-3 shadow-lg">CORE ART OFFICIAL</div>
                <h2 class="text-4xl lg:text-5xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] tracking-tight mb-3 leading-none font-[Noto Sans SC]">${slides[currentIndex].title}</h2>
                <p class="text-blue-100/90 text-[13px] font-bold max-w-lg leading-relaxed drop-shadow-md">${slides[currentIndex].subtitle}</p>
            </div>
            <button onclick="changeHomeSlide(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-[4px] border border-white/30 shadow-lg cursor-pointer z-20" data-tooltip="上一张"><i data-lucide="chevron-left"></i></button>
            <button onclick="changeHomeSlide(1)" class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-[4px] border border-white/30 shadow-lg cursor-pointer z-20" data-tooltip="下一张"><i data-lucide="chevron-right"></i></button>
        `;
        if (window.lucide) lucide.createIcons();
    }

    window.changeHomeSlide = (dir) => {
        currentIndex = (currentIndex + dir + slides.length) % slides.length;
        renderSlides();
    };

    renderSlides();
    setInterval(() => changeHomeSlide(1), 5000);
}

// --- 模态框逻辑 ---
window.openArtistModal = (id) => {
    const artist = ARTISTS.find(a => a.id === id);
    if(!artist) return;
    
    document.getElementById('modal-title').innerText = artist.name;
    document.getElementById('modal-category').innerText = artist.category;
    document.getElementById('modal-status-items').innerText = `Items: ${artist.gallery.length + 1}`;
    document.getElementById('modal-status-cat').innerText = `Classification: ${artist.category}`;
    
    document.getElementById('modal-body').innerHTML = `
        <div class="flex flex-col sm:flex-row gap-6 mb-8">
            <div class="w-32 h-32 shrink-0 bg-white p-1 shadow-[0_5px_15px_rgba(0,0,0,0.2)] border border-gray-300 -rotate-2">
                <img src="${artist.coverImage}" class="w-full h-full object-cover">
            </div>
            <div>
                <h1 class="text-3xl font-black text-[#1e395b] mb-2 font-['Varela Round'] tracking-tight">${artist.name}</h1>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${artist.tags.map(t => `<span class="text-[10px] font-bold bg-[#f0f8ff] text-[#0066cc] px-2 py-0.5 border border-[#aaddff] shadow-sm">${t}</span>`).join('')}
                </div>
                <p class="text-sm font-medium text-[#333] leading-relaxed">${artist.description}</p>
            </div>
        </div>
        <div class="space-y-3">
            <h3 class="font-bold text-[#003355] text-sm border-b border-[#dceeff] pb-1 flex items-center gap-2">
                <img src="https://raw.githubusercontent.com/Visnalize/resources/main/icons/win7/Windows%20Live%20Photo%20Gallery/WLXPhotoLibraryResources_238.ico" class="w-4 h-4"> 典型视觉印象
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                ${[artist.coverImage, ...artist.gallery].map(img => `
                    <div class="aspect-video bg-[#f0f0f0] p-1.5 border border-[#d2d2d2] shadow-sm hover:border-[#88ccff] transition-all cursor-pointer hover:shadow-md group overflow-hidden bg-gradient-to-br from-white to-[#eeeeee]">
                        <div class="w-full h-full border border-gray-200 overflow-hidden relative">
                            <img src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('artist-modal').classList.remove('hidden');
}

window.closeModal = () => {
    document.getElementById('artist-modal').classList.add('hidden');
}

// --- 全局搜索 ---
window.handleGlobalSearch = (e) => {
    e.preventDefault();
    const query = document.getElementById('header-search-input').value.trim().toLowerCase();
    if(!query) return;

    // Backdoor for admin login
    if (query === 'weirdcore666') {
        window.location.href = 'admin.html';
        return;
    }

    document.getElementById('search-query-display').innerText = query;
    const resultsContainer = document.getElementById('global-search-results');
    
    // 搜索逻辑
    const matchedResources = RESOURCES.flatMap(c => c.links).filter(l => l.title.toLowerCase().includes(query));
    const matchedArtists = ARTISTS.filter(a => a.name.toLowerCase().includes(query) || a.tags.join('').toLowerCase().includes(query));
    
    let html = '';
    
    if(matchedResources.length > 0) {
        html += `
            <div>
                <h4 class="font-bold text-[#004477] mb-2 border-b pb-1">相关资源 (${matchedResources.length})</h4>
                <div class="grid gap-2">
                    ${matchedResources.map(r => `
                        <a href="${r.url}" target="_blank" class="block p-3 bg-white/50 hover:bg-white rounded border border-transparent hover:border-[#aaddff] transition-all">
                            <div class="font-bold text-sm text-[#005588]">${r.title}</div>
                            <div class="text-xs text-gray-500">${r.description || '无描述'}</div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if(matchedArtists.length > 0) {
        html += `
            <div>
                <h4 class="font-bold text-[#004477] mb-2 border-b pb-1">相关美学条目 (${matchedArtists.length})</h4>
                <div class="grid gap-2">
                    ${matchedArtists.map(a => `
                        <div onclick="closeSearch(); window.location.href='aesthetics.html';" class="flex items-center gap-3 p-3 bg-white/50 hover:bg-white rounded border border-transparent hover:border-[#aaddff] transition-all cursor-pointer">
                            <img src="${a.coverImage}" class="w-10 h-10 object-cover rounded">
                            <div>
                                <div class="font-bold text-sm text-[#005588]">${a.name}</div>
                                <div class="text-xs text-gray-500">${a.category}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if(html === '') {
        html = `<div class="text-center text-gray-500 py-10">未找到与 "${query}" 相关的内容</div>`;
    }

    resultsContainer.innerHTML = html;
    document.getElementById('search-modal').classList.remove('hidden');
}

window.closeSearch = () => {
    document.getElementById('search-modal').classList.add('hidden');
}

// 键盘 ESC 关闭
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        closeModal();
        closeSearch();
    }
});
