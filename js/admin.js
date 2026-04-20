/**
 * Core Art Association - Admin Dashboard Logic
 * Handles data management, UI rendering, and persistence via localStorage.
 */

// --- Configuration ---
const MENU_GROUPS = [
    {
        title: '概览',
        items: [
            { id: 'dashboard', icon: 'layout-dashboard', label: '仪表盘', render: renderDashboard }
        ]
    },
    {
        title: '核心配置',
        items: [
            { id: 'config', icon: 'settings', label: '全局设置', render: renderSiteConfig },
            { id: 'layout', icon: 'layers', label: '可视化布局', render: renderVisualLayoutManager },
            { id: 'nav', icon: 'menu', label: '导航菜单', render: renderNavManager }
        ]
    },
    {
        title: '首页内容',
        items: [
            { id: 'slides', icon: 'monitor-play', label: '轮播图', render: renderSlidesManager },
            { id: 'marquee', icon: 'megaphone', label: '滚动公告', render: renderMarqueeManager },
            { id: 'news', icon: 'newspaper', label: '最新动态', render: renderNewsManager },
            { id: 'about', icon: 'info', label: '协会概况', render: renderAboutManager },
            { id: 'join', icon: 'user-plus', label: '加入社群', render: renderJoinManager }
        ]
    },
    {
        title: '内容管理',
        items: [
            { id: 'resources', icon: 'folder-open', label: '资源库', render: renderResourcesManager },
            { id: 'gallery', icon: 'image', label: '图集', render: renderGalleryManager },
            { id: 'musics', icon: 'music', label: '音乐', render: renderMusicManager },
            { id: 'videos', icon: 'video', label: '视频', render: renderVideoManager },
            { id: 'articles', icon: 'file-text', label: '文章', render: renderArticleManager },
            { id: 'aesthetics', icon: 'palette', label: '美学条目', render: renderAestheticsManager }
        ]
    },
    {
        title: '社区互动',
        items: [
            { id: 'social', icon: 'share-2', label: '社交媒体', render: renderSocialManager },
            { id: 'guestbook', icon: 'message-square', label: '留言板', render: renderGuestbookManager }
        ]
    }
];

let currentModuleId = 'dashboard';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    lucide.createIcons();
});

// --- Auth ---
function handleLogin(e) {
    e.preventDefault();
    const pwd = document.getElementById('admin-password').value;
    if (pwd === 'admin') { // Simple simulation
        sessionStorage.setItem('core_admin_auth', 'true');
        showInterface();
    } else {
        alert('密码错误');
    }
}

function checkLogin() {
    if (sessionStorage.getItem('core_admin_auth') === 'true') {
        showInterface();
    }
}

function handleLogout() {
    sessionStorage.removeItem('core_admin_auth');
    location.reload();
}

function showInterface() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-interface').classList.remove('hidden');
    document.getElementById('admin-interface').classList.add('flex');
    initSidebar();
    loadModule('dashboard');
}

// --- Sidebar ---
function initSidebar() {
    const nav = document.getElementById('admin-nav');
    nav.innerHTML = MENU_GROUPS.map(group => `
        <div class="mb-6">
            <h4 class="text-[10px] font-black text-[#88aabb] uppercase tracking-wider mb-2 px-3">${group.title}</h4>
            <div class="space-y-1">
                ${group.items.map(m => `
                    <button onclick="loadModule('${m.id}')" class="admin-sidebar-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#557799] hover:bg-white hover:text-[#005588] transition-all text-xs font-bold group ${m.id === currentModuleId ? 'bg-white text-[#005588] shadow-sm' : ''}" id="nav-${m.id}">
                        <i data-lucide="${m.icon}" class="w-4 h-4 group-hover:scale-110 transition-transform ${m.id === currentModuleId ? 'text-[#0099ff]' : ''}"></i>
                        ${m.label}
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function loadModule(id) {
    currentModuleId = id;
    
    // Update Sidebar UI
    document.querySelectorAll('.admin-sidebar-link').forEach(el => {
        el.classList.remove('bg-white', 'text-[#005588]', 'shadow-sm');
        const icon = el.querySelector('i');
        if(icon) icon.classList.remove('text-[#0099ff]');
    });
    
    const activeBtn = document.getElementById(`nav-${id}`);
    if(activeBtn) {
        activeBtn.classList.add('bg-white', 'text-[#005588]', 'shadow-sm');
        const icon = activeBtn.querySelector('i');
        if(icon) icon.classList.add('text-[#0099ff]');
    }
    
    // Find Module
    let module = null;
    for(const group of MENU_GROUPS) {
        const found = group.items.find(m => m.id === id);
        if(found) {
            module = found;
            break;
        }
    }
    
    if(module) {
        // Update Header
        document.getElementById('page-title').innerHTML = `<i data-lucide="${module.icon}" class="w-5 h-5 text-[#0088cc]"></i> ${module.label}`;
        
        // Render Content
        const container = document.getElementById('admin-content');
        container.innerHTML = ''; // Clear
        module.render(container);
        lucide.createIcons();
    }
}

// --- Renderers ---

function renderDashboard(container) {
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div class="relative z-10">
                        <h2 class="text-2xl font-black mb-2">Welcome back, Admin!</h2>
                        <p class="text-blue-100 text-sm max-w-md">System is running smoothly. You have 3 unread messages in the Guestbook.</p>
                        <button onclick="loadModule('guestbook')" class="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">Check Messages</button>
                    </div>
                    <div class="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                        <i data-lucide="activity" class="w-40 h-40"></i>
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${renderStatCard('Total Visits', '12,345', 'users', 'bg-blue-50 text-blue-600')}
                    ${renderStatCard('Articles', ARTICLES_DATA.length, 'file-text', 'bg-purple-50 text-purple-600')}
                    ${renderStatCard('Gallery', SLIDES_DATA.length, 'image', 'bg-pink-50 text-pink-600')}
                    ${renderStatCard('Messages', (JSON.parse(localStorage.getItem('core_guestbook')) || []).length, 'message-square', 'bg-green-50 text-green-600')}
                </div>

                <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i data-lucide="history" class="w-4 h-4 text-gray-500"></i> Recent Activity
                    </h3>
                    <div class="space-y-4">
                        ${[
                            { action: 'Updated homepage slider', time: '2 mins ago', user: 'Admin' },
                            { action: 'Published new article "Summer Event"', time: '1 hour ago', user: 'Admin' },
                            { action: 'System backup completed', time: '5 hours ago', user: 'System' },
                        ].map(log => `
                            <div class="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                <div class="flex items-center gap-3">
                                    <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <span class="text-gray-700">${log.action}</span>
                                </div>
                                <span class="text-gray-400 text-xs">${log.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-gray-900 text-white rounded-xl p-6 shadow-lg">
                    <h3 class="font-bold text-gray-200 mb-4 flex items-center gap-2">
                        <i data-lucide="cpu" class="w-4 h-4"></i> System Status
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-xs text-gray-400 mb-1">
                                <span>CPU Usage</span>
                                <span>12%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-1.5">
                                <div class="bg-green-500 h-1.5 rounded-full" style="width: 12%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Memory</span>
                                <span>45%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-1.5">
                                <div class="bg-blue-500 h-1.5 rounded-full" style="width: 45%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Storage</span>
                                <span>28%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-1.5">
                                <div class="bg-purple-500 h-1.5 rounded-full" style="width: 28%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                        <span>Version 2.0.1</span>
                        <span class="flex items-center gap-1 text-green-400"><div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Online</span>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 class="font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="loadModule('news')" class="p-3 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex flex-col items-center gap-2">
                            <i data-lucide="plus-circle" class="w-5 h-5"></i> Post News
                        </button>
                        <button onclick="loadModule('layout')" class="p-3 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors flex flex-col items-center gap-2">
                            <i data-lucide="layout" class="w-5 h-5"></i> Edit Layout
                        </button>
                        <button onclick="loadModule('settings')" class="p-3 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex flex-col items-center gap-2">
                            <i data-lucide="settings" class="w-5 h-5"></i> Settings
                        </button>
                        <button onclick="exportData()" class="p-3 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors flex flex-col items-center gap-2">
                            <i data-lucide="download" class="w-5 h-5"></i> Backup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStatCard(title, value, icon, colorClass) {
    return `
        <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <div class="w-10 h-10 rounded-full ${colorClass} flex items-center justify-center mb-2">
                <i data-lucide="${icon}" class="w-5 h-5"></i>
            </div>
            <div class="text-2xl font-black text-gray-800">${value}</div>
            <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">${title}</div>
        </div>
    `;
}

function renderSiteConfig(container) {
    const config = window.SITE_CONFIG;
    container.innerHTML = `
        <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm max-w-3xl">
            <h3 class="font-black text-[#004477] mb-6">全局设置</h3>
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-[#557799] mb-1">网站标题 (Title)</label>
                        <input type="text" value="${config.siteTitle}" class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-sm font-bold" onchange="updateSiteConfig('siteTitle', this.value)">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-[#557799] mb-1">副标题 (Subtitle)</label>
                        <input type="text" value="${config.siteSubtitle}" class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-sm font-bold" onchange="updateSiteConfig('siteSubtitle', this.value)">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">Logo URL</label>
                    <div class="flex gap-2">
                        <input type="text" value="${config.logoUrl}" class="flex-1 p-2 rounded border border-[#aaddff] bg-white/80 text-xs font-mono" onchange="updateSiteConfig('logoUrl', this.value)">
                        <img src="${config.logoUrl}" class="w-8 h-8 object-contain border border-gray-200 rounded bg-white">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">背景图片 URL</label>
                    <div class="flex gap-2">
                        <input type="text" value="${config.backgroundUrl}" class="flex-1 p-2 rounded border border-[#aaddff] bg-white/80 text-xs font-mono" onchange="updateSiteConfig('backgroundUrl', this.value)">
                        <div class="w-8 h-8 rounded border border-gray-200 bg-cover bg-center" style="background-image: url('${config.backgroundUrl}')"></div>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">页脚版权文字</label>
                    <input type="text" value="${config.footerText}" class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-sm" onchange="updateSiteConfig('footerText', this.value)">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">联系邮箱</label>
                    <input type="text" value="${config.contactEmail}" class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-sm" onchange="updateSiteConfig('contactEmail', this.value)">
                </div>
            </div>
        </div>
    `;
}

window.updateSiteConfig = (key, val) => {
    window.SITE_CONFIG[key] = val;
    saveToLocalStorage('SITE_CONFIG', window.SITE_CONFIG);
};

function renderVisualLayoutManager(container) {
    const layout = window.LAYOUT_CONFIG.home;
    const items = [
        { key: 'showMarquee', label: '顶部滚动公告', desc: '全站顶部的滚动文字通知栏', icon: 'megaphone' },
        { key: 'showSlider', label: '首页轮播图', desc: '首页顶部的大图轮播展示区', icon: 'monitor-play' },
        { key: 'showNews', label: '最新动态面板', desc: '展示最新的视频、活动或文章', icon: 'newspaper' },
        { key: 'showAbout', label: '协会概况面板', desc: '展示协会介绍与发展时间轴', icon: 'info' },
        { key: 'showStats', label: '访客统计面板', desc: '展示网站访问数据统计', icon: 'bar-chart-3' },
        { key: 'showJoin', label: '加入社群面板', desc: '展示QQ群加入引导信息', icon: 'user-plus' },
        { key: 'showFollow', label: '关注我们面板', desc: '展示社交媒体关注链接', icon: 'share-2' }
    ];

    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <i data-lucide="layout-template" class="w-5 h-5 text-blue-600 mt-0.5"></i>
                <div>
                    <h4 class="font-bold text-blue-800 text-sm">可视化布局管理</h4>
                    <p class="text-xs text-blue-600 mt-1">点击卡片右上角的开关来控制首页各板块的显示与隐藏。所见即所得，修改后立即生效。</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${items.map(item => `
                    <div class="relative bg-white border ${layout[item.key] ? 'border-[#0099ff] shadow-md' : 'border-gray-200 opacity-70'} rounded-xl p-5 transition-all duration-300 hover:shadow-lg group">
                        <div class="flex justify-between items-start mb-3">
                            <div class="w-10 h-10 rounded-lg ${layout[item.key] ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center transition-colors">
                                <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" ${layout[item.key] ? 'checked' : ''} onchange="updateLayoutConfig('home', '${item.key}', this.checked); loadModule('layout');">
                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0099ff]"></div>
                            </label>
                        </div>
                        <h4 class="font-black text-[#004477] text-sm mb-1">${item.label}</h4>
                        <p class="text-xs text-gray-500 leading-relaxed h-8 line-clamp-2">${item.desc}</p>
                        
                        ${layout[item.key] ? '<div class="absolute inset-0 border-2 border-[#0099ff] rounded-xl pointer-events-none opacity-10"></div>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.updateLayoutConfig = (page, key, val) => {
    window.LAYOUT_CONFIG[page][key] = val;
    saveToLocalStorage('LAYOUT_CONFIG', window.LAYOUT_CONFIG);
};

function renderSlidesManager(container) {
    renderDataGrid(container, {
        title: '首页轮播图管理',
        data: window.SLIDES_DATA,
        columns: [
            { key: 'title', label: '标题', type: 'text' },
            { key: 'subtitle', label: '副标题', type: 'text' },
            { key: 'url', label: '图片 URL', type: 'text' }
        ],
        onSave: (newData) => {
            window.SLIDES_DATA = newData;
            saveToLocalStorage('SLIDES_DATA', newData);
        }
    });
}

function renderJoinManager(container) {
    const config = window.JOIN_CONFIG;
    container.innerHTML = `
        <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm max-w-3xl">
            <h3 class="font-black text-[#004477] mb-6">加入社群面板配置</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">面板标题</label>
                    <input type="text" value="${config.title}" class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-sm font-bold" onchange="updateJoinConfig('title', this.value)">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">面板图标 URL</label>
                    <div class="flex gap-2">
                        <input type="text" value="${config.icon}" class="flex-1 p-2 rounded border border-[#aaddff] bg-white/80 text-xs font-mono" onchange="updateJoinConfig('icon', this.value)">
                        <img src="${config.icon}" class="w-8 h-8 object-contain border border-gray-200 rounded bg-white">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">欢迎文本</label>
                    <textarea class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-sm" rows="2" onchange="updateJoinConfig('welcomeText', this.value)">${config.welcomeText}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">群头像 URL</label>
                    <div class="flex gap-2">
                        <input type="text" value="${config.avatarUrl}" class="flex-1 p-2 rounded border border-[#aaddff] bg-white/80 text-xs font-mono" onchange="updateJoinConfig('avatarUrl', this.value)">
                        <img src="${config.avatarUrl}" class="w-8 h-8 object-cover rounded-full border border-gray-200 bg-white">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">QQ群跳转链接</label>
                    <input type="text" value="${config.qqGroupUrl}" class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-xs font-mono" onchange="updateJoinConfig('qqGroupUrl', this.value)">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#557799] mb-1">新手指引链接</label>
                    <input type="text" value="${config.helpUrl}" class="w-full p-2 rounded border border-[#aaddff] bg-white/80 text-xs font-mono" onchange="updateJoinConfig('helpUrl', this.value)">
                </div>
            </div>
        </div>
    `;
}

window.updateJoinConfig = (key, val) => {
    window.JOIN_CONFIG[key] = val;
    saveToLocalStorage('JOIN_CONFIG', window.JOIN_CONFIG);
};

function renderSocialManager(container) {
    renderDataGrid(container, {
        title: '社交媒体链接管理',
        data: window.SOCIAL_LINKS,
        columns: [
            { key: 'platform', label: '平台名称', type: 'text' },
            { key: 'url', label: '跳转链接', type: 'text' },
            { key: 'icon', label: '图标 URL', type: 'text' }
        ],
        onSave: (newData) => {
            window.SOCIAL_LINKS = newData;
            saveToLocalStorage('SOCIAL_LINKS', newData);
        }
    });
}

function renderNewsManager(container) {
    renderDataGrid(container, {
        title: '新闻列表',
        data: window.NEWS_ITEMS,
        columns: [
            { key: 'title', label: '标题', type: 'text' },
            { key: 'type', label: '类型', type: 'select', options: ['news', 'video', 'event', 'link'] },
            { key: 'url', label: '跳转链接', type: 'text' },
            { key: 'img', label: '封面图 URL', type: 'text' },
            { key: 'desc', label: '描述', type: 'text' }
        ],
        onSave: (newData) => {
            window.NEWS_ITEMS = newData;
            saveToLocalStorage('NEWS_ITEMS', newData);
        }
    });
}

function renderMarqueeManager(container) {
    container.innerHTML = `
        <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm max-w-2xl">
            <label class="block text-sm font-black text-[#004477] mb-2">滚动公告内容</label>
            <textarea id="marquee-input" class="w-full p-3 border border-[#aaddff] rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-[#0099ff]/30 text-sm font-medium h-32">${window.MARQUEE_TEXT}</textarea>
            <div class="mt-4 flex justify-end">
                <button onclick="saveMarquee()" class="px-4 py-2 bg-[#0099ff] text-white rounded-lg font-bold text-xs shadow-md hover:brightness-110">更新公告</button>
            </div>
        </div>
    `;
}

window.saveMarquee = () => {
    const text = document.getElementById('marquee-input').value;
    window.MARQUEE_TEXT = text;
    saveToLocalStorage('MARQUEE_TEXT', text);
    showToast('公告已更新');
};

function renderAboutManager(container) {
    // Simplified editor for About sections
    const html = `
        <div class="space-y-6">
            <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm">
                <h3 class="font-black text-[#004477] mb-4">概况卡片 (Sections)</h3>
                <div id="about-sections-editor" class="space-y-4">
                    ${window.ABOUT_DATA.sections.map((sec, idx) => `
                        <div class="p-4 bg-white border border-[#cceeff] rounded-lg group">
                            <div class="flex gap-4 mb-2">
                                <input type="text" value="${sec.title}" class="flex-1 font-bold text-sm border-b border-transparent hover:border-[#aaddff] focus:border-[#0099ff] outline-none bg-transparent" onchange="updateAboutSection(${idx}, 'title', this.value)">
                                <input type="text" value="${sec.icon}" class="w-24 text-xs font-mono text-gray-500 border-b border-transparent hover:border-[#aaddff] focus:border-[#0099ff] outline-none bg-transparent" title="Lucide Icon Name" onchange="updateAboutSection(${idx}, 'icon', this.value)">
                            </div>
                            <textarea class="w-full text-xs text-gray-600 bg-transparent outline-none resize-y border-l-2 border-transparent hover:border-[#aaddff] focus:border-[#0099ff] pl-2 py-1" rows="3" onchange="updateAboutSection(${idx}, 'content', this.value)">${sec.content}</textarea>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm">
                <h3 class="font-black text-[#004477] mb-4">大事记 (Timeline)</h3>
                <div id="about-timeline-editor" class="space-y-2">
                    ${window.ABOUT_DATA.timeline.map((item, idx) => `
                        <div class="flex gap-2 items-center">
                            <input type="text" value="${item.date}" class="w-24 p-2 rounded border border-[#cceeff] text-xs font-mono" onchange="updateAboutTimeline(${idx}, 'date', this.value)">
                            <input type="text" value="${item.title}" class="flex-1 p-2 rounded border border-[#cceeff] text-xs font-bold" onchange="updateAboutTimeline(${idx}, 'title', this.value)">
                            <button onclick="removeAboutTimeline(${idx})" class="text-red-500 hover:bg-red-50 p-1 rounded"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </div>
                    `).join('')}
                    <button onclick="addAboutTimeline()" class="w-full py-2 border-2 border-dashed border-[#aaddff] rounded-lg text-[#0088cc] text-xs font-bold hover:bg-[#f0f9ff] flex items-center justify-center gap-2 mt-2">
                        <i data-lucide="plus" class="w-4 h-4"></i> 添加事件
                    </button>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

// About Helpers
window.updateAboutSection = (idx, key, val) => {
    window.ABOUT_DATA.sections[idx][key] = val;
    saveToLocalStorage('ABOUT_DATA', window.ABOUT_DATA);
};
window.updateAboutTimeline = (idx, key, val) => {
    window.ABOUT_DATA.timeline[idx][key] = val;
    saveToLocalStorage('ABOUT_DATA', window.ABOUT_DATA);
};
window.addAboutTimeline = () => {
    window.ABOUT_DATA.timeline.push({ date: 'New Date', title: 'New Event' });
    saveToLocalStorage('ABOUT_DATA', window.ABOUT_DATA);
    loadModule('about'); // Re-render
};
window.removeAboutTimeline = (idx) => {
    window.ABOUT_DATA.timeline.splice(idx, 1);
    saveToLocalStorage('ABOUT_DATA', window.ABOUT_DATA);
    loadModule('about');
};

function renderResourcesManager(container) {
    // Grouped Data Grid
    const html = `
        <div class="space-y-8">
            ${window.RESOURCES.map((cat, catIdx) => `
                <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-black text-[#004477] flex items-center gap-2">
                            <img src="${cat.icon || 'img/folder.ico'}" class="w-5 h-5"> 
                            <input type="text" value="${cat.title}" class="bg-transparent border-b border-transparent focus:border-[#0099ff] outline-none" onchange="updateResourceCategory(${catIdx}, 'title', this.value)">
                        </h3>
                        <div class="flex gap-2">
                            <button onclick="updateResourceCategoryIcon(${catIdx})" class="text-xs bg-gray-100 text-gray-600 px-2 py-1.5 rounded hover:bg-gray-200">换图标</button>
                            <button onclick="addResourceLink(${catIdx})" class="text-xs bg-[#e6f4ff] text-[#0066cc] px-3 py-1.5 rounded-md font-bold hover:bg-[#d0e8ff]">+ 添加链接</button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        ${cat.links.map((link, linkIdx) => `
                            <div class="flex gap-3 items-start p-3 bg-white border border-[#e0efff] rounded-lg group hover:border-[#aaddff] transition-colors">
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <input type="text" value="${link.title}" class="font-bold text-sm text-[#004477] bg-transparent border-b border-transparent focus:border-[#0099ff] outline-none" placeholder="标题" onchange="updateResourceLink(${catIdx}, ${linkIdx}, 'title', this.value)">
                                    <input type="text" value="${link.url}" class="text-xs text-[#0088cc] bg-transparent border-b border-transparent focus:border-[#0099ff] outline-none" placeholder="URL" onchange="updateResourceLink(${catIdx}, ${linkIdx}, 'url', this.value)">
                                    <input type="text" value="${link.description || ''}" class="md:col-span-2 text-xs text-gray-500 bg-transparent border-b border-transparent focus:border-[#0099ff] outline-none w-full" placeholder="描述" onchange="updateResourceLink(${catIdx}, ${linkIdx}, 'description', this.value)">
                                </div>
                                <button onclick="removeResourceLink(${catIdx}, ${linkIdx})" class="text-gray-400 hover:text-red-500 p-1"><i data-lucide="trash" class="w-4 h-4"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            <button onclick="addResourceCategory()" class="w-full py-3 border-2 border-dashed border-[#aaddff] rounded-xl text-[#0088cc] font-bold hover:bg-[#f0f9ff]">+ 添加新分类</button>
        </div>
    `;
    container.innerHTML = html;
}

// Resource Helpers
window.updateResourceCategory = (catIdx, key, val) => {
    window.RESOURCES[catIdx][key] = val;
    saveToLocalStorage('RESOURCES', window.RESOURCES);
};
window.updateResourceCategoryIcon = (catIdx) => {
    const url = prompt("请输入新图标 URL (如 img/folder.ico):", window.RESOURCES[catIdx].icon);
    if(url) {
        window.RESOURCES[catIdx].icon = url;
        saveToLocalStorage('RESOURCES', window.RESOURCES);
        loadModule('resources');
    }
};
window.updateResourceLink = (catIdx, linkIdx, key, val) => {
    window.RESOURCES[catIdx].links[linkIdx][key] = val;
    saveToLocalStorage('RESOURCES', window.RESOURCES);
};
window.addResourceLink = (catIdx) => {
    window.RESOURCES[catIdx].links.push({ title: 'New Resource', url: '#', description: 'Description' });
    saveToLocalStorage('RESOURCES', window.RESOURCES);
    loadModule('resources');
};
window.removeResourceLink = (catIdx, linkIdx) => {
    window.RESOURCES[catIdx].links.splice(linkIdx, 1);
    saveToLocalStorage('RESOURCES', window.RESOURCES);
    loadModule('resources');
};
window.addResourceCategory = () => {
    window.RESOURCES.push({ title: "新分类", icon: "", links: [] });
    saveToLocalStorage('RESOURCES', window.RESOURCES);
    loadModule('resources');
};

function renderGalleryManager(container) {
    renderDataGrid(container, {
        title: '图集相册管理',
        data: window.ALBUMS,
        columns: [
            { key: 'title', label: '相册名称', type: 'text' },
            { key: 'count', label: '图片数', type: 'number' },
            { key: 'image', label: '封面图 URL', type: 'text' },
            { key: 'url', label: '跳转链接', type: 'text' }
        ],
        onSave: (newData) => {
            window.ALBUMS = newData;
            saveToLocalStorage('ALBUMS', newData);
        }
    });
}

function renderNavManager(container) {
    renderDataGrid(container, {
        title: '导航菜单管理',
        data: window.NAV_ITEMS,
        columns: [
            { key: 'id', label: 'ID (唯一标识)', type: 'text' },
            { key: 'text', label: '显示名称', type: 'text' },
            { key: 'href', label: '跳转链接', type: 'text' }
        ],
        onSave: (newData) => {
            window.NAV_ITEMS = newData;
            saveToLocalStorage('NAV_ITEMS', newData);
        }
    });
}

function renderMusicManager(container) {
    renderDataGrid(container, {
        title: '音乐播放列表管理',
        data: window.MUSIC_PLAYLIST,
        columns: [
            { key: 'title', label: '歌曲标题', type: 'text' },
            { key: 'artist', label: '艺术家', type: 'text' },
            { key: 'url', label: '音频文件 URL', type: 'text' },
            { key: 'cover', label: '封面图 URL', type: 'text' }
        ],
        onSave: (newData) => {
            window.MUSIC_PLAYLIST = newData;
            saveToLocalStorage('MUSIC_PLAYLIST', newData);
        }
    });
}

function renderVideoManager(container) {
    renderDataGrid(container, {
        title: '视频内容管理',
        data: window.VIDEOS_DATA,
        columns: [
            { key: 'title', label: '视频标题', type: 'text' },
            { key: 'url', label: '视频链接 (B站/外链)', type: 'text' },
            { key: 'cover', label: '封面图 URL', type: 'text' },
            { key: 'date', label: '发布日期', type: 'text' }
        ],
        onSave: (newData) => {
            window.VIDEOS_DATA = newData;
            saveToLocalStorage('VIDEOS_DATA', newData);
        }
    });
}

function renderArticleManager(container) {
    renderDataGrid(container, {
        title: '文章内容管理',
        data: window.ARTICLES_DATA,
        columns: [
            { key: 'title', label: '文章标题', type: 'text' },
            { key: 'summary', label: '摘要', type: 'text' },
            { key: 'url', label: '文章链接', type: 'text' },
            { key: 'cover', label: '封面图 URL', type: 'text' },
            { key: 'date', label: '发布日期', type: 'text' }
        ],
        onSave: (newData) => {
            window.ARTICLES_DATA = newData;
            saveToLocalStorage('ARTICLES_DATA', newData);
        }
    });
}

function renderAestheticsManager(container) {
    // Aesthetics (Artists) data is complex (nested arrays), so we use a custom renderer or simplified grid
    // For now, let's use a simplified grid and maybe JSON edit for complex parts if needed, 
    // or just flatten the tags/gallery for display.
    // To keep it simple and functional within the grid system, we might need to simplify editing.
    // But the user wants "comprehensive".
    // Let's try to render a grid where "tags" is a comma-separated string.
    
    // Pre-process data for grid
    const gridData = window.ARTISTS.map(a => ({
        ...a,
        tagsStr: a.tags ? a.tags.join(', ') : '',
        galleryCount: a.gallery ? a.gallery.length : 0
    }));

    renderDataGrid(container, {
        title: '美学条目 (Artists) 管理',
        data: gridData,
        columns: [
            { key: 'id', label: 'ID', type: 'text' },
            { key: 'name', label: '名称', type: 'text' },
            { key: 'category', label: '分类', type: 'text' },
            { key: 'tagsStr', label: '标签 (逗号分隔)', type: 'text' },
            { key: 'coverImage', label: '封面图 URL', type: 'text' },
            { key: 'description', label: '描述', type: 'text' }
        ],
        onSave: (newData) => {
            // Post-process back to original structure
            const processedData = newData.map(row => {
                const original = window.ARTISTS.find(a => a.id === row.id) || { gallery: [] };
                return {
                    id: row.id,
                    name: row.name,
                    category: row.category,
                    description: row.description,
                    coverImage: row.coverImage,
                    tags: row.tagsStr.split(',').map(s => s.trim()).filter(s => s),
                    gallery: original.gallery // Preserve gallery for now as grid doesn't edit it
                };
            });
            window.ARTISTS = processedData;
            saveToLocalStorage('ARTISTS', processedData);
        }
    });
    
    container.insertAdjacentHTML('beforeend', `<p class="mt-2 text-xs text-gray-500">注：目前仅支持编辑基本信息。图集图片管理功能待开发。</p>`);
}

function renderGuestbookManager(container) {
    const msgs = JSON.parse(localStorage.getItem('core_guestbook')) || [];
    
    const html = `
        <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-black text-[#004477]">留言管理 (${msgs.length})</h3>
                <button onclick="clearGuestbook()" class="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md font-bold hover:bg-red-200">清空所有</button>
            </div>
            <div class="space-y-3">
                ${msgs.map((msg, idx) => `
                    <div class="p-4 bg-white border border-[#e0efff] rounded-lg flex gap-4 items-start">
                        <img src="${msg.avatar}" class="w-10 h-10 rounded-md border border-gray-200">
                        <div class="flex-1">
                            <div class="flex justify-between items-start">
                                <div>
                                    <span class="font-black text-sm text-[#004477]">${msg.name}</span>
                                    <span class="text-xs text-gray-400 ml-2">${msg.date}</span>
                                </div>
                                <button onclick="deleteMessage(${idx})" class="text-gray-400 hover:text-red-500"><i data-lucide="x" class="w-4 h-4"></i></button>
                            </div>
                            <p class="text-xs text-gray-600 mt-1">${msg.content}</p>
                        </div>
                    </div>
                `).join('')}
                ${msgs.length === 0 ? '<div class="text-center text-gray-400 py-4">暂无留言</div>' : ''}
            </div>
        </div>
    `;
    container.innerHTML = html;
}

window.deleteMessage = (idx) => {
    const msgs = JSON.parse(localStorage.getItem('core_guestbook')) || [];
    msgs.splice(idx, 1);
    localStorage.setItem('core_guestbook', JSON.stringify(msgs));
    loadModule('guestbook');
};

window.clearGuestbook = () => {
    if(confirm('确定要清空所有留言吗？此操作不可恢复。')) {
        localStorage.setItem('core_guestbook', '[]');
        loadModule('guestbook');
    }
};

// --- Generic Data Grid Component with Image Preview ---
function renderDataGrid(container, config) {
    const { title, data, columns, onSave } = config;
    
    // Create a local copy for editing
    let localData = JSON.parse(JSON.stringify(data));

    const renderTable = () => {
        return `
            <div class="bg-white/60 border border-white rounded-xl p-6 shadow-sm overflow-hidden">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-black text-[#004477]">${title}</h3>
                    <button id="add-row-btn" class="text-xs bg-[#e6f4ff] text-[#0066cc] px-3 py-1.5 rounded-md font-bold hover:bg-[#d0e8ff] flex items-center gap-1">
                        <i data-lucide="plus" class="w-3 h-3"></i> 新增条目
                    </button>
                </div>
                <div class="overflow-x-auto border border-[#cceeff] rounded-lg">
                    <table class="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr class="bg-[#f8fbff] border-b border-[#e0efff] text-xs font-black text-[#557799] uppercase tracking-wider">
                                ${columns.map(c => `<th class="p-3 whitespace-nowrap">${c.label}</th>`).join('')}
                                <th class="p-3 w-16 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody id="grid-body">
                            ${localData.map((row, rowIdx) => `
                                <tr class="border-b border-[#f0f0f0] hover:bg-[#fcfdff] transition-colors group">
                                    ${columns.map(col => `
                                        <td class="p-2 min-w-[150px] align-top">
                                            ${renderCellInput(col, row, rowIdx)}
                                        </td>
                                    `).join('')}
                                    <td class="p-2 text-center align-middle">
                                        <button onclick="removeGridRow(${rowIdx})" class="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${localData.length === 0 ? '<div class="text-center py-8 text-gray-400 text-xs">暂无数据，请点击右上角新增</div>' : ''}
            </div>
        `;
    };

    const renderCellInput = (col, row, rowIdx) => {
        const val = row[col.key] || '';
        
        const isImageField = ['img', 'cover', 'icon', 'avatar', 'image'].some(k => col.key.toLowerCase().includes(k)) || (col.key === 'url' && (title.includes('轮播') || title.includes('相册')));

        if (isImageField) {
            return `
                <div class="flex gap-2 items-start">
                    <div class="w-10 h-10 shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 ring-blue-200 transition-all relative group/img" title="点击预览大图">
                        ${val ? `<img src="${val}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/40x40?text=Error'">` : '<i data-lucide="image" class="w-4 h-4 text-gray-300"></i>'}
                    </div>
                    <div class="flex-1 min-w-0">
                        <input type="text" value="${val}" class="w-full bg-transparent text-xs border-b border-transparent hover:border-[#aaddff] focus:border-[#0099ff] p-1 outline-none transition-colors text-gray-600 font-mono" placeholder="输入图片URL..." onchange="updateGridData(${rowIdx}, '${col.key}', this.value)">
                    </div>
                </div>
            `;
        }

        if (col.type === 'select') {
            return `
                <select class="w-full bg-transparent text-xs border border-gray-200 hover:border-[#aaddff] focus:border-[#0099ff] rounded p-1.5 outline-none transition-colors text-[#004477] font-bold" onchange="updateGridData(${rowIdx}, '${col.key}', this.value)">
                    ${col.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            `;
        }

        return `
            <input type="${col.type === 'number' ? 'number' : 'text'}" value="${val}" class="w-full bg-transparent text-xs border border-transparent hover:border-[#aaddff] focus:border-[#0099ff] rounded p-1.5 outline-none transition-colors text-[#004477] font-medium placeholder-gray-300" onchange="updateGridData(${rowIdx}, '${col.key}', this.value)">
        `;
    };

    container.innerHTML = renderTable();

    // Attach event listeners manually
    document.getElementById('add-row-btn').onclick = () => {
        const newRow = {};
        columns.forEach(c => newRow[c.key] = c.type === 'number' ? 0 : '');
        localData.push(newRow);
        onSave(localData);
        loadModule(currentModuleId); // Re-render
    };

    // Expose update function globally for this instance
    window.updateGridData = (rowIdx, key, val) => {
        localData[rowIdx][key] = val;
        onSave(localData);
    };
    
    window.removeGridRow = (rowIdx) => {
        if(confirm('确定要删除此条目吗？')) {
            localData.splice(rowIdx, 1);
            onSave(localData);
            loadModule(currentModuleId);
        }
    };
}

// --- Persistence & Export ---

function saveToLocalStorage(key, data) {
    localStorage.setItem(`core_${key}`, JSON.stringify(data));
    showToast('已保存到本地');
}

window.saveAllData = () => {
    // Trigger saves for all known data types
    saveToLocalStorage('NEWS_ITEMS', window.NEWS_ITEMS);
    saveToLocalStorage('MARQUEE_TEXT', window.MARQUEE_TEXT);
    saveToLocalStorage('ABOUT_DATA', window.ABOUT_DATA);
    saveToLocalStorage('RESOURCES', window.RESOURCES);
    saveToLocalStorage('ALBUMS', window.ALBUMS);
    saveToLocalStorage('SOCIAL_LINKS', window.SOCIAL_LINKS);
    saveToLocalStorage('SLIDES_DATA', window.SLIDES_DATA);
    saveToLocalStorage('SITE_CONFIG', window.SITE_CONFIG);
    saveToLocalStorage('LAYOUT_CONFIG', window.LAYOUT_CONFIG);
    saveToLocalStorage('JOIN_CONFIG', window.JOIN_CONFIG);
    
    saveToLocalStorage('NAV_ITEMS', window.NAV_ITEMS);
    saveToLocalStorage('MUSIC_PLAYLIST', window.MUSIC_PLAYLIST);
    saveToLocalStorage('VIDEOS_DATA', window.VIDEOS_DATA);
    saveToLocalStorage('ARTICLES_DATA', window.ARTICLES_DATA);
    saveToLocalStorage('ARTISTS', window.ARTISTS);
    
    showToast('所有数据已保存');
};

window.exportDataJS = () => {
    const jsContent = `/**
 * Core Art Association - Data Source
 * Generated by Admin Dashboard on ${new Date().toLocaleString()}
 */

// 社交媒体链接
window.SOCIAL_LINKS = ${JSON.stringify(window.SOCIAL_LINKS, null, 4)};

// 首页轮播图数据
window.SLIDES_DATA = ${JSON.stringify(window.SLIDES_DATA, null, 4)};

// 全局站点配置
window.SITE_CONFIG = ${JSON.stringify(window.SITE_CONFIG, null, 4)};

// 页面布局配置
window.LAYOUT_CONFIG = ${JSON.stringify(window.LAYOUT_CONFIG, null, 4)};

// 加入社群配置
window.JOIN_CONFIG = ${JSON.stringify(window.JOIN_CONFIG, null, 4)};

// 顶部跑马灯内容
window.MARQUEE_TEXT = ${JSON.stringify(window.MARQUEE_TEXT)};

// 最新动态数据
window.NEWS_ITEMS = ${JSON.stringify(window.NEWS_ITEMS, null, 4)};

// 协会概况数据
window.ABOUT_DATA = ${JSON.stringify(window.ABOUT_DATA, null, 4)};

// 资源库数据
window.RESOURCES = ${JSON.stringify(window.RESOURCES, null, 4)};

// 图集数据
window.ALBUMS = ${JSON.stringify(window.ALBUMS, null, 4)};

// 艺术家/美学数据
window.ARTISTS = ${JSON.stringify(window.ARTISTS, null, 4)};

// 导航菜单
window.NAV_ITEMS = ${JSON.stringify(window.NAV_ITEMS, null, 4)};

// 音乐列表
window.MUSIC_PLAYLIST = ${JSON.stringify(window.MUSIC_PLAYLIST, null, 4)};

// 视频数据
window.VIDEOS_DATA = ${JSON.stringify(window.VIDEOS_DATA, null, 4)};

// 文章数据
window.ARTICLES_DATA = ${JSON.stringify(window.ARTICLES_DATA, null, 4)};

// 检查本地存储覆盖 (Admin Overrides)
if(typeof localStorage !== 'undefined') {
    if(localStorage.getItem('core_NEWS_ITEMS')) window.NEWS_ITEMS = JSON.parse(localStorage.getItem('core_NEWS_ITEMS'));
    if(localStorage.getItem('core_MARQUEE_TEXT')) {
        let mq = localStorage.getItem('core_MARQUEE_TEXT');
        try { mq = JSON.parse(mq); } catch(e) {}
        window.MARQUEE_TEXT = mq;
    }
    if(localStorage.getItem('core_ABOUT_DATA')) window.ABOUT_DATA = JSON.parse(localStorage.getItem('core_ABOUT_DATA'));
    if(localStorage.getItem('core_RESOURCES')) window.RESOURCES = JSON.parse(localStorage.getItem('core_RESOURCES'));
    if(localStorage.getItem('core_ALBUMS')) window.ALBUMS = JSON.parse(localStorage.getItem('core_ALBUMS'));
    
    // New Configs
    if(localStorage.getItem('core_SOCIAL_LINKS')) window.SOCIAL_LINKS = JSON.parse(localStorage.getItem('core_SOCIAL_LINKS'));
    if(localStorage.getItem('core_SLIDES_DATA')) window.SLIDES_DATA = JSON.parse(localStorage.getItem('core_SLIDES_DATA'));
    if(localStorage.getItem('core_SITE_CONFIG')) window.SITE_CONFIG = JSON.parse(localStorage.getItem('core_SITE_CONFIG'));
    if(localStorage.getItem('core_LAYOUT_CONFIG')) window.LAYOUT_CONFIG = JSON.parse(localStorage.getItem('core_LAYOUT_CONFIG'));
    if(localStorage.getItem('core_JOIN_CONFIG')) window.JOIN_CONFIG = JSON.parse(localStorage.getItem('core_JOIN_CONFIG'));
    
    // Additional Data
    if(localStorage.getItem('core_MUSIC_PLAYLIST')) window.MUSIC_PLAYLIST = JSON.parse(localStorage.getItem('core_MUSIC_PLAYLIST'));
    if(localStorage.getItem('core_VIDEOS_DATA')) window.VIDEOS_DATA = JSON.parse(localStorage.getItem('core_VIDEOS_DATA'));
    if(localStorage.getItem('core_ARTICLES_DATA')) window.ARTICLES_DATA = JSON.parse(localStorage.getItem('core_ARTICLES_DATA'));
    if(localStorage.getItem('core_NAV_ITEMS')) window.NAV_ITEMS = JSON.parse(localStorage.getItem('core_NAV_ITEMS'));
    if(localStorage.getItem('core_ARTISTS')) window.ARTISTS = JSON.parse(localStorage.getItem('core_ARTISTS'));
}
`;

    // Create blob and download
    const blob = new Blob([jsContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('data.js 已生成并下载');
};

function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    msgEl.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}