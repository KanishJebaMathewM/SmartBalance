// Memories functionality for Work-Life Balance App

class MemoriesManager {
    constructor() {
        this.currentTab = 'memories-gallery';
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeSlideshowListeners();
        this.loadMemoriesData();
        this.loadBirthdaysData();
        console.log('✅ Memories Manager initialized');
    }

    initializeEventListeners() {
        // Memory form submission
        const memoryForm = document.getElementById('memoryForm');
        if (memoryForm) {
            memoryForm.addEventListener('submit', (e) => this.handleMemorySubmit(e));
        }

        // Birthday form submission
        const birthdayForm = document.getElementById('birthdayForm');
        if (birthdayForm) {
            birthdayForm.addEventListener('submit', (e) => this.handleBirthdaySubmit(e));
        }

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.closest('.memories-tabs .tab-btn')) {
                const tabBtn = e.target.closest('.tab-btn');
                const tabName = tabBtn.dataset.tab;
                this.switchTab(tabName);
            }
        });

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.memories-filters .filter-btn')) {
                const filterBtn = e.target.closest('.filter-btn');
                const filter = filterBtn.dataset.filter;
                this.setFilter(filter);
            }
        });

        // Search functionality
        const searchInput = document.getElementById('memorySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderMemories();
            });
        }

        // Image preview
        const imageInput = document.getElementById('memoryImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.previewImage(e));
        }

        // Modal buttons
        const addMemoryBtn = document.getElementById('addMemoryBtn');
        const addBirthdayBtn = document.getElementById('addBirthdayBtn');

        if (addMemoryBtn) {
            addMemoryBtn.addEventListener('click', () => this.openMemoryModal());
        }

        if (addBirthdayBtn) {
            addBirthdayBtn.addEventListener('click', () => this.openBirthdayModal());
        }
    }

    // Tab Management
    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.memories-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('#memories .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Load data for the active tab
        if (tabName === 'memories-gallery') {
            this.renderMemories();
        } else if (tabName === 'birthdays-list') {
            this.renderBirthdays();
        }
    }

    // Filter Management
    setFilter(filter) {
        this.currentFilter = filter;

        // Update filter buttons
        document.querySelectorAll('.memories-filters .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.renderMemories();
    }

    // Memory Management
    openMemoryModal() {
        // Set default date to today
        const memoryDate = document.getElementById('memoryDate');
        if (memoryDate) {
            memoryDate.value = new Date().toISOString().split('T')[0];
        }

        // Clear form
        const memoryForm = document.getElementById('memoryForm');
        if (memoryForm) {
            memoryForm.reset();
        }

        // Clear image preview
        this.clearImagePreview();

        // Open modal
        if (window.app) {
            window.app.openModal('memoryModal');
        }
    }

    handleMemorySubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const imageFile = document.getElementById('memoryImage').files[0];

        if (!imageFile) {
            Utils.showNotification('Please select an image', 'error');
            return;
        }

        // Read the image file
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;

            const memory = {
                id: Date.now(),
                title: formData.get('memoryTitle') || document.getElementById('memoryTitle').value,
                description: formData.get('memoryDescription') || document.getElementById('memoryDescription').value,
                date: formData.get('memoryDate') || document.getElementById('memoryDate').value,
                favorite: document.getElementById('memoryFavorite').checked,
                imageData: imageData,
                fileName: imageFile.name,
                fileSize: imageFile.size,
                createdAt: new Date().toISOString()
            };

            this.saveMemory(memory);
        };

        reader.readAsDataURL(imageFile);
    }

    saveMemory(memory) {
        try {
            // Get existing memories
            const memories = this.getMemories();
            memories.push(memory);

            // Save to localStorage
            localStorage.setItem('memories', JSON.stringify(memories));

            Utils.showNotification('Memory saved successfully! 📸', 'success');

            // Close modal and refresh
            if (window.app) {
                window.app.closeModal('memoryModal');
            }

            this.loadMemoriesData();
            this.renderMemories();

        } catch (error) {
            console.error('Error saving memory:', error);
            Utils.showNotification('Failed to save memory. Image might be too large.', 'error');
        }
    }

    getMemories() {
        try {
            return JSON.parse(localStorage.getItem('memories')) || [];
        } catch (error) {
            console.error('Error loading memories:', error);
            return [];
        }
    }

    previewImage(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('imagePreview');

        if (!file) {
            this.clearImagePreview();
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Utils.showNotification('Image is too large. Please choose an image under 5MB.', 'error');
            e.target.value = '';
            this.clearImagePreview();
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }

    clearImagePreview() {
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = '<div class="empty">Image preview will appear here</div>';
        }
    }

    renderMemories() {
        const memoriesContainer = document.getElementById('memoriesGallery');
        if (!memoriesContainer) return;

        const memories = this.getFilteredMemories();

        if (memories.length === 0) {
            memoriesContainer.innerHTML = `
                <div class="empty-memories">
                    <h3>No memories yet</h3>
                    <p>Start capturing your precious moments!</p>
                    <button class="btn-primary" onclick="memoriesManager.openMemoryModal()">Add First Memory</button>
                </div>
            `;
            return;
        }

        memoriesContainer.innerHTML = memories.map(memory => `
            <div class="memory-card" onclick="memoriesManager.viewMemory(${memory.id})">
                <img src="${memory.imageData}" alt="${memory.title}" class="memory-image">
                <div class="memory-content">
                    <div class="memory-title">${Utils.sanitizeInput(memory.title)}</div>
                    <div class="memory-description">${Utils.sanitizeInput(memory.description || '')}</div>
                    <div class="memory-meta">
                        <div class="memory-date">${this.formatMemoryDate(memory.date)}</div>
                        <div class="memory-actions">
                            ${memory.favorite ? '<span class="memory-favorite">⭐</span>' : ''}
                            <button onclick="event.stopPropagation(); memoriesManager.editMemory(${memory.id})" title="Edit">✏️</button>
                            <button onclick="event.stopPropagation(); memoriesManager.deleteMemory(${memory.id})" title="Delete">🗑️</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getFilteredMemories() {
        let memories = this.getMemories();

        // Apply filters
        switch (this.currentFilter) {
            case 'recent':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                memories = memories.filter(m => new Date(m.date) >= thirtyDaysAgo);
                break;
            case 'favorites':
                memories = memories.filter(m => m.favorite);
                break;
        }

        // Apply search
        if (this.searchQuery) {
            memories = memories.filter(memory =>
                memory.title.toLowerCase().includes(this.searchQuery) ||
                (memory.description && memory.description.toLowerCase().includes(this.searchQuery))
            );
        }

        // Sort by date (newest first)
        return memories.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    formatMemoryDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    }

    viewMemory(memoryId) {
        const memory = this.getMemories().find(m => m.id === memoryId);
        if (!memory) return;

        const modalContent = document.getElementById('memoryViewContent');
        if (!modalContent) return;

        modalContent.innerHTML = `
            <img src="${memory.imageData}" alt="${memory.title}" class="memory-view-image">
            <div class="memory-view-title">${Utils.sanitizeInput(memory.title)}</div>
            <div class="memory-view-description">${Utils.sanitizeInput(memory.description || '')}</div>
            <div class="memory-view-meta">
                <div class="memory-date">${Utils.formatDate(memory.date)}</div>
                <div class="memory-actions">
                    ${memory.favorite ? '<span class="memory-favorite">⭐ Favorite</span>' : ''}
                    <button onclick="memoriesManager.editMemory(${memory.id})" class="btn-secondary">Edit</button>
                    <button onclick="memoriesManager.deleteMemory(${memory.id})" class="btn-danger">Delete</button>
                </div>
            </div>
        `;

        if (window.app) {
            window.app.openModal('memoryViewModal');
        }
    }

    editMemory(memoryId) {
        const memory = this.getMemories().find(m => m.id === memoryId);
        if (!memory) return;

        // Populate form with memory data
        document.getElementById('memoryTitle').value = memory.title;
        document.getElementById('memoryDescription').value = memory.description || '';
        document.getElementById('memoryDate').value = memory.date;
        document.getElementById('memoryFavorite').checked = memory.favorite;

        // Show image preview
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = `<img src="${memory.imageData}" alt="Current image">`;
        }

        // Store the ID for updating
        document.getElementById('memoryForm').dataset.editId = memoryId;

        if (window.app) {
            window.app.closeModal('memoryViewModal');
            window.app.openModal('memoryModal');
        }
    }

    deleteMemory(memoryId) {
        if (!confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
            return;
        }

        const memories = this.getMemories().filter(m => m.id !== memoryId);
        localStorage.setItem('memories', JSON.stringify(memories));

        Utils.showNotification('Memory deleted', 'info');

        // Close any open modals and refresh
        if (window.app) {
            window.app.closeModal('memoryViewModal');
        }

        this.loadMemoriesData();
        this.renderMemories();
    }

    // Birthday Management
    openBirthdayModal() {
        // Clear form
        const birthdayForm = document.getElementById('birthdayForm');
        if (birthdayForm) {
            birthdayForm.reset();
            document.getElementById('birthdayReminder').checked = true;
        }

        if (window.app) {
            window.app.openModal('birthdayModal');
        }
    }

    handleBirthdaySubmit(e) {
        e.preventDefault();

        const birthday = {
            id: Date.now(),
            name: document.getElementById('birthdayName').value,
            date: document.getElementById('birthdayDate').value,
            relation: document.getElementById('birthdayRelation').value,
            notes: document.getElementById('birthdayNotes').value,
            reminder: document.getElementById('birthdayReminder').checked,
            createdAt: new Date().toISOString()
        };

        this.saveBirthday(birthday);
    }

    saveBirthday(birthday) {
        const birthdays = this.getBirthdays();
        birthdays.push(birthday);

        localStorage.setItem('birthdays', JSON.stringify(birthdays));

        Utils.showNotification('Birthday saved successfully! 🎂', 'success');

        if (window.app) {
            window.app.closeModal('birthdayModal');
        }

        this.loadBirthdaysData();
        this.renderBirthdays();
    }

    getBirthdays() {
        try {
            return JSON.parse(localStorage.getItem('birthdays')) || [];
        } catch (error) {
            console.error('Error loading birthdays:', error);
            return [];
        }
    }

    renderBirthdays() {
        this.renderUpcomingBirthdays();
        this.renderAllBirthdays();
    }

    renderUpcomingBirthdays() {
        const container = document.getElementById('upcomingBirthdaysList');
        if (!container) return;

        const upcomingBirthdays = this.getUpcomingBirthdays();

        if (upcomingBirthdays.length === 0) {
            container.innerHTML = `
                <div class="empty-birthdays">
                    <p>No upcoming birthdays in the next 30 days</p>
                </div>
            `;
            return;
        }

        container.innerHTML = upcomingBirthdays.map(birthday => `
            <div class="birthday-item ${birthday.daysLeft === 0 ? 'today' : birthday.daysLeft <= 7 ? 'upcoming' : ''}">
                <div class="birthday-icon">${this.getRelationIcon(birthday.relation)}</div>
                <div class="birthday-info">
                    <div class="birthday-name">${Utils.sanitizeInput(birthday.name)}</div>
                    <div class="birthday-date">${this.formatBirthdayDate(birthday.date)}</div>
                    <div class="birthday-days-left">
                        ${birthday.daysLeft === 0 ? 'Today! 🎉' : 
                          birthday.daysLeft === 1 ? 'Tomorrow' : 
                          `In ${birthday.daysLeft} days`}
                    </div>
                </div>
                <div class="birthday-actions">
                    <button onclick="memoriesManager.editBirthday(${birthday.id})" title="Edit">✏️</button>
                    <button onclick="memoriesManager.deleteBirthday(${birthday.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    renderAllBirthdays() {
        const container = document.getElementById('allBirthdaysList');
        if (!container) return;

        const birthdays = this.getBirthdays().sort((a, b) => {
            const aMonth = new Date(a.date).getMonth();
            const bMonth = new Date(b.date).getMonth();
            const aDay = new Date(a.date).getDate();
            const bDay = new Date(b.date).getDate();
            
            if (aMonth !== bMonth) return aMonth - bMonth;
            return aDay - bDay;
        });

        if (birthdays.length === 0) {
            container.innerHTML = `
                <div class="empty-birthdays">
                    <p>No birthdays added yet</p>
                    <button class="btn-primary" onclick="memoriesManager.openBirthdayModal()">Add First Birthday</button>
                </div>
            `;
            return;
        }

        container.innerHTML = birthdays.map(birthday => `
            <div class="birthday-item">
                <div class="birthday-icon">${this.getRelationIcon(birthday.relation)}</div>
                <div class="birthday-info">
                    <div class="birthday-name">${Utils.sanitizeInput(birthday.name)}</div>
                    <div class="birthday-date">${this.formatBirthdayDate(birthday.date)}</div>
                    ${birthday.notes ? `<div class="birthday-notes">${Utils.sanitizeInput(birthday.notes)}</div>` : ''}
                </div>
                <div class="birthday-actions">
                    <button onclick="memoriesManager.editBirthday(${birthday.id})" title="Edit">✏️</button>
                    <button onclick="memoriesManager.deleteBirthday(${birthday.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    getUpcomingBirthdays() {
        const birthdays = this.getBirthdays();
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        return birthdays.map(birthday => {
            const birthdayThisYear = new Date(today.getFullYear(), new Date(birthday.date).getMonth(), new Date(birthday.date).getDate());
            let birthdayNext = birthdayThisYear;

            // If birthday has passed this year, check next year
            if (birthdayThisYear < today) {
                birthdayNext = new Date(today.getFullYear() + 1, new Date(birthday.date).getMonth(), new Date(birthday.date).getDate());
            }

            const daysLeft = Math.ceil((birthdayNext - today) / (1000 * 60 * 60 * 24));

            return {
                ...birthday,
                nextBirthday: birthdayNext,
                daysLeft: daysLeft
            };
        })
        .filter(birthday => birthday.daysLeft <= 30)
        .sort((a, b) => a.daysLeft - b.daysLeft);
    }

    getRelationIcon(relation) {
        const icons = {
            family: '👨‍👩‍👧‍👦',
            friend: '👫',
            colleague: '💼',
            other: '👤'
        };
        return icons[relation] || '👤';
    }

    formatBirthdayDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric'
        });
    }

    editBirthday(birthdayId) {
        const birthday = this.getBirthdays().find(b => b.id === birthdayId);
        if (!birthday) return;

        // Populate form
        document.getElementById('birthdayName').value = birthday.name;
        document.getElementById('birthdayDate').value = birthday.date;
        document.getElementById('birthdayRelation').value = birthday.relation;
        document.getElementById('birthdayNotes').value = birthday.notes || '';
        document.getElementById('birthdayReminder').checked = birthday.reminder;

        // Store the ID for updating
        document.getElementById('birthdayForm').dataset.editId = birthdayId;

        if (window.app) {
            window.app.openModal('birthdayModal');
        }
    }

    deleteBirthday(birthdayId) {
        if (!confirm('Are you sure you want to delete this birthday?')) {
            return;
        }

        const birthdays = this.getBirthdays().filter(b => b.id !== birthdayId);
        localStorage.setItem('birthdays', JSON.stringify(birthdays));

        Utils.showNotification('Birthday deleted', 'info');

        this.loadBirthdaysData();
        this.renderBirthdays();
    }

    // Data Loading and Stats
    loadMemoriesData() {
        this.updateMemoriesStats();
        if (this.currentTab === 'memories-gallery') {
            this.renderMemories();
        }
    }

    loadBirthdaysData() {
        this.updateBirthdaysStats();
        if (this.currentTab === 'birthdays-list') {
            this.renderBirthdays();
        }
    }

    updateMemoriesStats() {
        const memories = this.getMemories();
        
        // Total memories
        const totalMemoriesEl = document.getElementById('totalMemories');
        if (totalMemoriesEl) {
            totalMemoriesEl.textContent = memories.length;
        }

        // Memories this month
        const thisMonth = new Date();
        const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        const memoriesThisMonth = memories.filter(m => new Date(m.date) >= startOfMonth).length;
        
        const memoriesThisMonthEl = document.getElementById('memoriesThisMonth');
        if (memoriesThisMonthEl) {
            memoriesThisMonthEl.textContent = memoriesThisMonth;
        }

        // Storage used
        const totalSize = memories.reduce((sum, m) => sum + (m.fileSize || 0), 0);
        const memoriesSizeEl = document.getElementById('memoriesSize');
        if (memoriesSizeEl) {
            memoriesSizeEl.textContent = `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
        }
    }

    updateBirthdaysStats() {
        const upcomingBirthdays = this.getUpcomingBirthdays();
        
        const upcomingBirthdaysEl = document.getElementById('upcomingBirthdays');
        if (upcomingBirthdaysEl) {
            upcomingBirthdaysEl.textContent = upcomingBirthdays.length;
        }
    }
}

// Initialize Memories Manager
let memoriesManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    memoriesManager = new MemoriesManager();
});

// Make it globally available
window.memoriesManager = memoriesManager;
