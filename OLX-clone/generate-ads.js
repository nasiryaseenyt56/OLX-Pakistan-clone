const sampleAds = [
    {
        id: '1',
        title: 'iPhone 13 Pro Max 256GB',
        description: 'Excellent condition iPhone with original box and accessories',
        price: 180000,
        category: 'mobiles',
        location: 'Karachi',
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop']
    },
    {
        id: '2',
        title: 'Honda Civic 2020',
        description: 'Well maintained Honda Civic with low mileage',
        price: 4500000,
        category: 'vehicles',
        location: 'Lahore',
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop']
    },
    {
        id: '3',
        title: '2 Bedroom Apartment',
        description: 'Beautiful apartment in prime location',
        price: 15000000,
        category: 'property',
        location: 'Islamabad',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop']
    },
    {
        id: '4',
        title: 'Samsung Galaxy S23',
        description: 'Brand new Samsung Galaxy S23 with warranty',
        price: 120000,
        category: 'mobiles',
        location: 'Karachi',
        images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop']
    },
    {
        id: '5',
        title: 'Honda CD 70 2023',
        description: 'New Honda CD 70 motorcycle',
        price: 85000,
        category: 'bikes',
        location: 'Lahore',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop']
    },
    {
        id: '6',
        title: 'Samsung 55" Smart TV',
        description: '4K Smart TV with HDR support',
        price: 95000,
        category: 'electronics',
        location: 'Islamabad',
        images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop']
    },
    {
        id: '7',
        title: 'Restaurant Business for Sale',
        description: 'Running restaurant business in commercial area',
        price: 2500000,
        category: 'business',
        location: 'Lahore',
        images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop']
    },
    {
        id: '8',
        title: 'Home Cleaning Service',
        description: 'Professional home cleaning service available',
        price: 3000,
        category: 'services',
        location: 'Islamabad',
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop']
    },
    {
        id: '9',
        title: 'Software Developer Required',
        description: 'Looking for experienced React.js developer',
        price: 80000,
        category: 'jobs',
        location: 'Lahore',
        images: ['https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop']
    },
    {
        id: '10',
        title: 'Golden Retriever Puppy',
        description: 'Healthy and vaccinated Golden Retriever puppy',
        price: 45000,
        category: 'animals',
        location: 'Islamabad',
        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop']
    },
    {
        id: '11',
        title: '5 Seater Sofa Set',
        description: 'Comfortable 5 seater sofa set in excellent condition',
        price: 85000,
        category: 'furniture',
        location: 'Karachi',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop']
    },
    {
        id: '12',
        title: 'Designer Wedding Dress',
        description: 'Beautiful designer wedding dress, worn once',
        price: 35000,
        category: 'fashion',
        location: 'Islamabad',
        images: ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop']
    },
    {
        id: '13',
        title: '2 Bedroom Apartment for Rent',
        description: 'Furnished 2 bedroom apartment in Gulberg',
        price: 45000,
        category: 'property-rent',
        location: 'Lahore',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop']
    },
    {
        id: '14',
        title: 'iPad Air 5th Generation',
        description: 'Brand new iPad Air with Apple Pencil support',
        price: 95000,
        category: 'tablets',
        location: 'Lahore',
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop']
    },
    {
        id: '15',
        title: '5 Marla Plot for Sale',
        description: 'Prime location 5 marla plot in DHA Phase 6',
        price: 8500000,
        category: 'land-plots',
        location: 'Lahore',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop']
    }
];

function generateAdPage(ad) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>${ad.title} - OLX Pakistan</title>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="../index.html">
                        <img src="https://logos-world.net/wp-content/uploads/2022/04/OLX-Logo.png" alt="OLX" width="50">
                    </a>
                </div>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    <select>
                        <option>Pakistan</option>
                    </select>
                </div>
                <div class="search-bar">
                    <input type="text" placeholder="Find Cars, Mobile Phones and more...">
                    <button><i class="fas fa-search"></i></button>
                </div>
                <div class="header-actions">
                    <div class="auth-buttons">
                        <button class="login-btn">Login</button>
                        <button class="sell-btn"><i class="fas fa-plus"></i> SELL</button>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <main class="ad-page">
        <div class="container">
            <div class="breadcrumb">
                <a href="../index.html">Home</a> > <span>${ad.category}</span> > ${ad.title}
            </div>
            
            <div class="ad-detail-page">
                <div class="ad-images-section">
                    <img src="${ad.images[0]}" alt="${ad.title}" class="main-ad-image">
                </div>
                
                <div class="ad-info-section">
                    <h1>${ad.title}</h1>
                    <div class="ad-price">Rs ${ad.price.toLocaleString()}</div>
                    <div class="ad-location"><i class="fas fa-map-marker-alt"></i> ${ad.location}</div>
                    
                    <div class="ad-description">
                        <h3>Description</h3>
                        <p>${ad.description}</p>
                    </div>
                    
                    <div class="ad-details">
                        <h3>Details</h3>
                        <div class="detail-item">
                            <span>Category:</span>
                            <span>${ad.category}</span>
                        </div>
                        <div class="detail-item">
                            <span>Posted:</span>
                            <span>Recently</span>
                        </div>
                        <div class="detail-item">
                            <span>Seller:</span>
                            <span>Demo User</span>
                        </div>
                    </div>
                    
                    <div class="contact-section">
                        <button class="contact-btn" onclick="window.location.href='mailto:demo@example.com'">
                            <i class="fas fa-envelope"></i> Contact Seller
                        </button>
                        <button class="phone-btn">
                            <i class="fas fa-phone"></i> Show Phone Number
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2024 OLX Pakistan. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

sampleAds.forEach(ad => {
    const content = generateAdPage(ad);
    console.log(`Generated ad-${ad.id}.html`);
});