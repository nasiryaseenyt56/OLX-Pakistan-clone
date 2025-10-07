



let currentUser = null;
let currentPage = 1;
let isLoading = false;
let currentCategory = '';
let currentSearchTerm = '';

const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const sellModal = document.getElementById('sellModal');
const adModal = document.getElementById('adModal');
const adsContainer = document.getElementById('adsContainer');

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadAds();


   });

function initializeEventListeners() {

    document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('sellBtn').addEventListener('click', handleSellClick);
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.getAttribute('data-category');
            if (category === 'all') {
                currentCategory = '';
            } else {
                currentCategory = category;
            }
            currentPage = 1;
            loadAds();
        });
    });

    document.getElementById('gridView').addEventListener('click', () => setView('grid'));
    document.getElementById('listView').addEventListener('click', () => setView('list'));

    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreAds);

    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', closeModals);
    });

    document.getElementById('showSignup').addEventListener('click', () => {
        closeModals();
        showModal('signupModal');
    });

    document.getElementById('showLogin').addEventListener('click', () => {
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

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    currentUser = {
        displayName: 'Demo User',
        email: email
    };
    
    closeModals();
    updateAuthUI();
    showMessage('Login successful!', 'success');
    document.getElementById('loginForm').reset();
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    currentUser = {
        displayName: name,
        email: email
    };
    
    closeModals();
    updateAuthUI();
    showMessage('Account created successfully!', 'success');
    document.getElementById('signupForm').reset();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.displayName || 'Profile'}`;
        loginBtn.onclick = () => window.location.href = 'profile.html';
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => showModal('loginModal');
    }
}

function showProfileDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-item" onclick="viewProfile()">
            <i class="fas fa-user"></i> My Profile
        </div>
        <div class="dropdown-item" onclick="viewMyAds()">
            <i class="fas fa-list"></i> My Ads
        </div>
        <div class="dropdown-item" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i> Logout
        </div>
    `;
    
    document.body.appendChild(dropdown);
    
    setTimeout(() => {
        dropdown.addEventListener('click', () => dropdown.remove());
        document.addEventListener('click', () => dropdown.remove(), { once: true });
    }, 100);
}

function viewProfile() {
    window.location.href = 'profile.html';
}

function viewMyAds() {
    alert('My Ads page - Coming soon!');
}

function logout() {
    currentUser = null;
    updateAuthUI();
    showMessage('Logged out successfully!', 'success');
}

function handleSellClick() {
    if (!currentUser) {
        alert('You are not logged in. Please login first.');
        showModal('loginModal');
        return;
    }
    window.location.href = 'sell.html';
}

function handleSellSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }

    closeModals();
    showMessage('Ad posted successfully! (Demo mode)', 'success');
    document.getElementById('sellForm').reset();
    loadAds();
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

function loadAds() {
    if (isLoading) return;
    isLoading = true;
    
    showLoading();
    
    setTimeout(() => {
        if (currentPage === 1) {
            adsContainer.innerHTML = '';
        }
        
        showSampleAds();
        isLoading = false;
        hideLoading();
    }, 500);
}

function showSampleAds() {
    const sampleAds = [
        {
            id: '1',
            title: 'iPhone 13 Pro Max 256GB',
            description: 'Excellent condition iPhone with original box and accessories',
            price: 180000,
            category: 'mobiles',
            location: 'Karachi',
            images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '2',
            title: 'Honda Civic 2020',
            description: 'Well maintained Honda Civic with low mileage',
            price: 4500000,
            category: 'vehicles',
            location: 'Lahore',
            images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '3',
            title: '2 Bedroom Apartment',
            description: 'Beautiful apartment in prime location',
            price: 15000000,
            category: 'property',
            location: 'Islamabad',
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '4',
            title: 'Samsung Galaxy S23',
            description: 'Brand new Samsung Galaxy S23 with warranty',
            price: 120000,
            category: 'mobiles',
            location: 'Karachi',
            images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '5',
            title: 'Honda CD 70 2023',
            description: 'New Honda CD 70 motorcycle',
            price: 85000,
            category: 'bikes',
            location: 'Lahore',
            images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '6',
            title: 'Samsung 55" Smart TV',
            description: '4K Smart TV with HDR support',
            price: 95000,
            category: 'electronics',
            location: 'Islamabad',
            images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '7',
            title: 'Restaurant Business for Sale',
            description: 'Running restaurant business in commercial area',
            price: 2500000,
            category: 'business',
            location: 'Lahore',
            images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '8',
            title: 'Home Cleaning Service',
            description: 'Professional home cleaning service available',
            price: 3000,
            category: 'services',
            location: 'Islamabad',
            images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '9',
            title: 'Software Developer Required',
            description: 'Looking for experienced React.js developer',
            price: 80000,
            category: 'jobs',
            location: 'Lahore',
            images: ['https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '10',
            title: 'Golden Retriever Puppy',
            description: 'Healthy and vaccinated Golden Retriever puppy',
            price: 45000,
            category: 'animals',
            location: 'Islamabad',
            images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '11',
            title: '5 Seater Sofa Set',
            description: 'Comfortable 5 seater sofa set in excellent condition',
            price: 85000,
            category: 'furniture',
            location: 'Karachi',
            images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '12',
            title: 'Designer Wedding Dress',
            description: 'Beautiful designer wedding dress, worn once',
            price: 35000,
            category: 'fashion',
            location: 'Islamabad',
            images: ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '13',
            title: '2 Bedroom Apartment for Rent',
            description: 'Furnished 2 bedroom apartment in Gulberg',
            price: 45000,
            category: 'property-rent',
            location: 'Lahore',
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '14',
            title: 'iPad Air 5th Generation',
            description: 'Brand new iPad Air with Apple Pencil support',
            price: 95000,
            category: 'tablets',
            location: 'Lahore',
            images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop'],
            createdAt: new Date()
        },
        {
            id: '15',
            title: '5 Marla Plot for Sale',
            description: 'Prime location 5 marla plot in DHA Phase 6',
            price: 8500000,
            category: 'land-plots',
            location: 'Lahore',
            images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop'],
            createdAt: new Date()
        }
    ];
    
    let filteredAds = sampleAds;
    
    if (currentCategory) {
        filteredAds = sampleAds.filter(ad => ad.category === currentCategory);
    }
    
    if (currentSearchTerm) {
        filteredAds = filteredAds.filter(ad => 
            ad.title.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }
    
    if (filteredAds.length === 0) {
        showNoResults();
    } else {
        filteredAds.forEach(ad => displayAd(ad));
    }
}

function displayAd(ad) {
    const adCard = document.createElement('div');
    adCard.className = 'ad-card';
    adCard.onclick = () => window.location.href = `ads/ad-${ad.id}.html`;
    
    const imageUrl = ad.images && ad.images.length > 0 
        ? ad.images[0] 
        : 'https://via.placeholder.com/300x200?text=No+Image';
    
    const createdAt = 'Recently';
    
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
    const createdAt = 'Recently';
    
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
                        <span>Demo User</span>
                    </div>
                </div>
                <button class="contact-seller" onclick="contactSeller('demo@example.com')">
                    <i class="fas fa-phone"></i> Contact Seller
                </button>
            </div>
        </div>
    `;
    
    showModal('adModal');
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

function handleSearch() {
    currentSearchTerm = document.getElementById('searchInput').value.trim();
    currentPage = 1;
    currentCategory = '';
    loadAds();
}

function setView(view) {
    const gridBtn = document.getElementById('gridView');
    const listBtn = document.getElementById('listView');
    
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
    loadAds();
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
        adsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Loading ads...</p></div>';
    }
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) loading.remove();
}

function showNoResults() {
    adsContainer.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No ads found</h3>
            <p>Try adjusting your search or browse different categories</p>
        </div>
    `;
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

function addSampleAds() {
    const sampleAds = [
        {
            title: "iPhone 13 Pro Max 256GB",
            description: "Excellent condition iPhone 13 Pro Max with original box and accessories",
            price: 180000,
            category: "mobiles",
            location: "Karachi",
            userId: "demo",
            userEmail: "demo@example.com",
            userName: "Demo User",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            images: ["https://via.placeholder.com/400x300?text=iPhone+13+Pro"]
        },
        {
            title: "Honda Civic 2020",
            description: "Well maintained Honda Civic 2020 model with low mileage",
            price: 4500000,
            category: "vehicles",
            location: "Lahore",
            userId: "demo",
            userEmail: "demo@example.com",
            userName: "Demo User",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            images: ["https://via.placeholder.com/400x300?text=Honda+Civic"]
        },
        {
            title: "2 Bedroom Apartment",
            description: "Beautiful 2 bedroom apartment in prime location",
            price: 15000000,
            category: "property",
            location: "Islamabad",
            userId: "demo",
            userEmail: "demo@example.com",
            userName: "Demo User",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            images: ["https://via.placeholder.com/400x300?text=Apartment"]
        }
    ];

    sampleAds.forEach(ad => {
        db.collection('ads').add(ad);
    });
}