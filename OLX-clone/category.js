const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

let currentUser = null;
let currentPage = 1;
let isLoading = false;
let currentFilters = {};
let currentSearchTerm = '';

function getCurrentCategory() {
    const path = window.location.pathname;
    if (path.includes('mobile-phones')) return 'mobiles';
    if (path.includes('cars')) return 'cars';
    if (path.includes('motorcycles')) return 'motorcycles';
    if (path.includes('houses')) return 'houses';
    if (path.includes('tv-video-audio')) return 'tv-video-audio';
    if (path.includes('tablets')) return 'tablets';
    if (path.includes('land-plots')) return 'land-plots';
    return 'all';
}

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadCategoryAds();
    
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateAuthUI();
    });
});

function initializeEventListeners() {
    document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('sellBtn').addEventListener('click', handleSellClick);
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    document.getElementById('gridView').addEventListener('click', () => setView('grid'));
    document.getElementById('listView').addEventListener('click', () => setView('list'));

    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreAds);

    const filters = ['brandFilter', 'priceFilter', 'conditionFilter', 'yearFilter', 'engineFilter', 'bedroomFilter', 'typeFilter', 'storageFilter', 'sizeFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', handleFilterChange);
        }
    });

    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', closeModals);
    });

    document.getElementById('showSignup')?.addEventListener('click', () => {
        closeModals();
        showModal('signupModal');
    });

    document.getElementById('showLogin')?.addEventListener('click', () => {
        closeModals();
        showModal('loginModal');
    });

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('sellForm').addEventListener('submit', handleSellSubmit);

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

async function loadCategoryAds() {
    if (isLoading) return;
    isLoading = true;
    
    showLoading();
    
    try {
        const category = getCurrentCategory();
        let query = db.collection('ads').orderBy('createdAt', 'desc');
        
        if (category !== 'all') {
            query = query.where('category', '==', category);
        }
        
        if (currentSearchTerm) {
            query = query.where('title', '>=', currentSearchTerm)
                         .where('title', '<=', currentSearchTerm + '\uf8ff');
        }
        
        Object.keys(currentFilters).forEach(key => {
            if (currentFilters[key]) {
                if (key === 'priceFilter') {
                    const [min, max] = currentFilters[key].split('-').map(Number);
                    query = query.where('price', '>=', min);
                    if (max < 999999999) {
                        query = query.where('price', '<=', max);
                    }
                } else {
                    query = query.where(key.replace('Filter', ''), '==', currentFilters[key]);
                }
            }
        });
        
        const snapshot = await query.limit(20).get();
        
        if (currentPage === 1) {
            document.getElementById('adsContainer').innerHTML = '';
        }
        
        if (snapshot.empty) {
            showNoResults();
            updateResultsCount(0);
        } else {
            snapshot.forEach(doc => {
                const ad = { id: doc.id, ...doc.data() };
                displayAd(ad);
            });
            updateResultsCount(snapshot.size);
        }
    } catch (error) {
        showMessage('Error loading ads: ' + error.message, 'error');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

function displayAd(ad) {
    const adsContainer = document.getElementById('adsContainer');
    const adCard = document.createElement('div');
    adCard.className = 'ad-card';
    adCard.onclick = () => showAdDetails(ad);
    
    const imageUrl = ad.images && ad.images.length > 0 
        ? ad.images[0] 
        : 'https://via.placeholder.com/300x200?text=No+Image';
    
    const createdAt = ad.createdAt ? ad.createdAt.toDate().toLocaleDateString() : 'Recently';
    
    adCard.innerHTML = `
        <img src="${imageUrl}" alt="${ad.title}" class="ad-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="ad-content">
            <div class="ad-price">Rs ${ad.price.toLocaleString()}</div>
            <div class="ad-title">${ad.title}</div>
            <div class="ad-location">
                <i class="fas fa-map-marker-alt"></i>
                ${ad.location}
            </div>
            <div class="ad-date">${createdAt}</div>
        </div>
    `;
    
    adsContainer.appendChild(adCard);
}

function showAdDetails(ad) {
    const adDetails = document.getElementById('adDetails');
    const createdAt = ad.createdAt ? ad.createdAt.toDate().toLocaleDateString() : 'Recently';
    
    let imagesHtml = '';
    if (ad.images && ad.images.length > 0) {
        const mainImage = ad.images[0];
        const thumbnails = ad.images.map((img, index) => 
            `<img src="${img}" class="ad-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}')">`
        ).join('');
        
        imagesHtml = `
            <div class="ad-images">
                <img src="${mainImage}" id="mainImage" class="ad-main-image">
                <div class="ad-thumbnails">${thumbnails}</div>
            </div>
        `;
    }
    
    adDetails.innerHTML = `
        <div class="ad-detail">
            <div class="ad-main">
                ${imagesHtml}
                <div class="ad-info">
                    <h1>${ad.title}</h1>
                    <div class="ad-price-large">Rs ${ad.price.toLocaleString()}</div>
                    <div class="ad-description">${ad.description}</div>
                </div>
            </div>
            <div class="ad-sidebar">
                <div class="ad-meta">
                    <h3>Details</h3>
                    <div class="meta-item">
                        <span>Price</span>
                        <span>Rs ${ad.price.toLocaleString()}</span>
                    </div>
                    <div class="meta-item">
                        <span>Location</span>
                        <span>${ad.location}</span>
                    </div>
                    <div class="meta-item">
                        <span>Category</span>
                        <span>${ad.category}</span>
                    </div>
                    <div class="meta-item">
                        <span>Posted</span>
                        <span>${createdAt}</span>
                    </div>
                    <div class="meta-item">
                        <span>Seller</span>
                        <span>${ad.userName}</span>
                    </div>
                </div>
                <button class="contact-seller" onclick="contactSeller('${ad.userEmail}')">
                    <i class="fas fa-phone"></i> Contact Seller
                </button>
            </div>
        </div>
    `;
    
    showModal('adModal');
}

function handleFilterChange(e) {
    const filterId = e.target.id;
    const value = e.target.value;
    
    if (value) {
        currentFilters[filterId] = value;
    } else {
        delete currentFilters[filterId];
    }
    
    currentPage = 1;
    loadCategoryAds();
}

function handleSearch() {
    currentSearchTerm = document.getElementById('searchInput').value.trim();
    currentPage = 1;
    loadCategoryAds();
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeModals();
        showMessage('Login successful!', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        closeModals();
        showMessage('Account created successfully!', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.textContent = currentUser.displayName || 'Account';
        loginBtn.onclick = () => auth.signOut();
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => showModal('loginModal');
    }
}

function handleSellClick() {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }
    showModal('sellModal');
}

async function handleSellSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }

    const category = document.getElementById('sellCategory').value || getCurrentCategory();
    const formData = {
        category: category,
        title: document.getElementById('sellTitle').value,
        description: document.getElementById('sellDescription').value,
        price: parseInt(document.getElementById('sellPrice').value),
        location: document.getElementById('sellLocation').value,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || 'Anonymous',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        images: []
    };

    const brandSelect = document.getElementById('brandSelect');
    if (brandSelect) formData.brand = brandSelect.value;
    
    const conditionSelect = document.getElementById('conditionSelect');
    if (conditionSelect) formData.condition = conditionSelect.value;
    
    const yearInput = document.getElementById('yearInput');
    if (yearInput) formData.year = parseInt(yearInput.value);

    try {
        const imageFiles = document.getElementById('sellImages').files;
        if (imageFiles.length > 0) {
            const imageUrls = await uploadImages(imageFiles);
            formData.images = imageUrls;
        }

        await db.collection('ads').add(formData);
        closeModals();
        showMessage('Ad posted successfully!', 'success');
        document.getElementById('sellForm').reset();
        loadCategoryAds();
    } catch (error) {
        showMessage('Error posting ad: ' + error.message, 'error');
    }
}

async function uploadImages(files) {
    const uploadPromises = Array.from(files).map(async (file, index) => {
        const fileName = `ads/${Date.now()}_${index}_${file.name}`;
        const storageRef = storage.ref().child(fileName);
        const snapshot = await storageRef.put(file);
        return await snapshot.ref.getDownloadURL();
    });
    
    return await Promise.all(uploadPromises);
}

function changeMainImage(src) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.ad-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === src) {
            thumb.classList.add('active');
        }
    });
}

function contactSeller(email) {
    window.location.href = `mailto:${email}?subject=Inquiry about your OLX ad`;
}

function setView(view) {
    const gridBtn = document.getElementById('gridView');
    const listBtn = document.getElementById('listView');
    const adsContainer = document.getElementById('adsContainer');
    
    if (view === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        adsContainer.classList.remove('list-view');
    } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        adsContainer.classList.add('list-view');
    }
}

function loadMoreAds() {
    currentPage++;
    loadCategoryAds();
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showLoading() {
    if (currentPage === 1) {
        document.getElementById('adsContainer').innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Loading ads...</p></div>';
    }
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) loading.remove();
}

function showNoResults() {
    document.getElementById('adsContainer').innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No ads found</h3>
            <p>Try adjusting your filters or search terms</p>
        </div>
    `;
}

function updateResultsCount(count) {
    const category = getCurrentCategory();
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('resultsCount').textContent = `${count} ${categoryName} ads found`;
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}