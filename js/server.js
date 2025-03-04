// Simple Node.js server with a JSON file database
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Database file paths
const PRODUCTS_DB = path.join(__dirname, 'db', 'products.json');
const USERS_DB = path.join(__dirname, 'db', 'users.json');
const ORDERS_DB = path.join(__dirname, 'db', 'orders.json');

// Ensure database directory exists
if (!fs.existsSync(path.join(__dirname, 'db'))) {
    fs.mkdirSync(path.join(__dirname, 'db'));
}

// Initialize database files if they don't exist
function initializeDatabase() {
    // Products database
    if (!fs.existsSync(PRODUCTS_DB)) {
        const initialProducts = [
            {
                id: 1,
                name: "Ethiopian Yirgacheffe",
                origin: "Ethiopia",
                price: 24.99,
                description: "Bright, fruity notes with a floral aroma. These seeds produce plants that thrive in high-altitude environments.",
                featured: true,
                stock: 50,
                image: "/images/ethiopian.jpg"
            },
            {
                id: 2,
                name: "Colombian Supremo",
                origin: "Colombia",
                price: 19.99,
                description: "Well-balanced with caramel sweetness and a nutty finish. Adaptable to various growing conditions.",
                featured: true,
                stock: 75,
                image: "/images/colombian.jpg"
            },
            {
                id: 3,
                name: "Jamaican Blue Mountain",
                origin: "Jamaica",
                price: 39.99,
                description: "Smooth, clean taste with mild sweetness and minimal bitterness. Grows best in rich, volcanic soil.",
                featured: true,
                stock: 30,
                image: "/images/jamaican.jpg"
            },
            {
                id: 4,
                name: "Sumatra Mandheling",
                origin: "Indonesia",
                price: 22.99,
                description: "Full-bodied with earthy, herbal notes and low acidity. Resilient plants suitable for humid climates.",
                featured: true,
                stock: 60,
                image: "/images/sumatra.jpg"
            },
            {
                id: 5,
                name: "Costa Rican Tarrazu",
                origin: "Costa Rica",
                price: 21.99,
                description: "Bright acidity with citrus notes and a clean finish. Grows well in moderate temperatures.",
                featured: false,
                stock: 45,
                image: "/images/costarican.jpg"
            },
            {
                id: 6,
                name: "Kenyan AA",
                origin: "Kenya",
                price: 26.99,
                description: "Bold, vibrant flavor with wine-like acidity and blackcurrant notes. Best for sunny locations.",
                featured: false,
                stock: 40,
                image: "/images/kenyan.jpg"
            }
        ];
        fs.writeFileSync(PRODUCTS_DB, JSON.stringify(initialProducts, null, 2));
        console.log('Products database initialized');
    }

    // Users database
    if (!fs.existsSync(USERS_DB)) {
        const initialUsers = [];
        fs.writeFileSync(USERS_DB, JSON.stringify(initialUsers, null, 2));
        console.log('Users database initialized');
    }

    // Orders database
    if (!fs.existsSync(ORDERS_DB)) {
        const initialOrders = [];
        fs.writeFileSync(ORDERS_DB, JSON.stringify(initialOrders, null, 2));
        console.log('Orders database initialized');
    }
}

// Database operations
const db = {
    // Product operations
    products: {
        getAll: () => {
            const data = fs.readFileSync(PRODUCTS_DB, 'utf8');
            return JSON.parse(data);
        },
        getById: (id) => {
            const products = db.products.getAll();
            return products.find(product => product.id === id);
        },
        getFeatured: () => {
            const products = db.products.getAll();
            return products.filter(product => product.featured);
        },
        updateStock: (id, quantity) => {
            const products = db.products.getAll();
            const productIndex = products.findIndex(product => product.id === id);
            
            if (productIndex === -1) return false;
            
            products[productIndex].stock -= quantity;
            fs.writeFileSync(PRODUCTS_DB, JSON.stringify(products, null, 2));
            return true;
        },
        create: (product) => {
            const products = db.products.getAll();
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            
            const newProduct = { id: newId, ...product };
            products.push(newProduct);
            
            fs.writeFileSync(PRODUCTS_DB, JSON.stringify(products, null, 2));
            return newProduct;
        }
    },
    
    // User operations
    users: {
        getAll: () => {
            const data = fs.readFileSync(USERS_DB, 'utf8');
            return JSON.parse(data);
        },
        getByEmail: (email) => {
            const users = db.users.getAll();
            return users.find(user => user.email === email);
        },
        create: (user) => {
            const users = db.users.getAll();
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            
            const newUser = { id: newId, ...user };
            users.push(newUser);
            
            fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));
            return newUser;
        }
    },
    
    // Order operations
    orders: {
        getAll: () => {
            const data = fs.readFileSync(ORDERS_DB, 'utf8');
            return JSON.parse(data);
        },
        getByUserId: (userId) => {
            const orders = db.orders.getAll();
            return orders.filter(order => order.userId === userId);
        },
        create: (order) => {
            const orders = db.orders.getAll();
            const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
            
            const newOrder = { 
                id: newId, 
                date: new Date().toISOString(),
                status: 'pending',
                ...order 
            };
            
            orders.push(newOrder);
            
            fs.writeFileSync(ORDERS_DB, JSON.stringify(orders, null, 2));
            
            // Update product stock
            order.items.forEach(item => {
                db.products.updateStock(item.productId, item.quantity);
            });
            
            return newOrder;
        },
        updateStatus: (orderId, status) => {
            const orders = db.orders.getAll();
            const orderIndex = orders.findIndex(order => order.id === orderId);
            
            if (orderIndex === -1) return false;
            
            orders[orderIndex].status = status;
            fs.writeFileSync(ORDERS_DB, JSON.stringify(orders, null, 2));
            return true;
        }
    }
};

// MIME types for serving static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

// Server creation
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // API endpoints
    if (pathname.startsWith('/api')) {
        handleApiRequest(req, res, pathname, parsedUrl.query);
        return;
    }
    
    // Serve static files
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    
    // Check if filePath points to a directory, if so, serve the index.html in that directory
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    
    // Get file extension
    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'text/plain';
    
    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                serveErrorPage(res, 404, 'Page Not Found');
            } else {
                // Server error
                serveErrorPage(res, 500, 'Server Error');
            }
            return;
        }
        
        // Successful response
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf8');
    });
});

// Handle API requests
function handleApiRequest(req, res, pathname, query) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // Handle different endpoints
    if (pathname === '/api/products' && req.method === 'GET') {
        const featured = query.featured === 'true';
        const productId = query.id ? parseInt(query.id) : null;
        
        let products;
        
        if (productId) {
            products = db.products.getById(productId);
            if (!products) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Product not found' }));
                return;
            }
        } else if (featured) {
            products = db.products.getFeatured();
        } else {
            products = db.products.getAll();
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
        return;
    }
    
    if (pathname === '/api/products' && req.method === 'POST') {
        // Handle product creation (admin only)
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const product = JSON.parse(body);
                const newProduct = db.products.create(product);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newProduct));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request data' }));
            }
        });
        
        return;
    }
    
    if (pathname === '/api/users/register' && req.method === 'POST') {
        // Handle user registration
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                
                // Check if user already exists
                const existingUser = db.users.getByEmail(userData.email);
                if (existingUser) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User with this email already exists' }));
                    return;
                }
                
                // In a real app, you'd hash the password here
                const newUser = db.users.create({
                    email: userData.email,
                    name: userData.name,
                    password: userData.password, // This would be hashed in production
                    address: userData.address
                });
                
                // Remove password before sending response
                const { password, ...userWithoutPassword } = newUser;
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(userWithoutPassword));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request data' }));
            }
        });
        
        return;
    }
    
    if (pathname === '/api/users/login' && req.method === 'POST') {
        // Handle user login
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);
                
                // Find user
                const user = db.users.getByEmail(email);
                
                if (!user || user.password !== password) { // In real app, compare hashed passwords
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    return;
                }
                
                // Remove password before sending response
                const { password: userPassword, ...userWithoutPassword } = user;
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    user: userWithoutPassword,
                    // In a real app, generate a JWT token here
                    token: `fake-jwt-token-${user.id}-${Date.now()}`
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request data' }));
            }
        });
        
        return;
    }
    
    if (pathname === '/api/orders' && req.method === 'POST') {
        // Handle order creation
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const orderData = JSON.parse(body);
                
                // Validate order data
                if (!orderData.userId || !orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid order data' }));
                    return;
                }
                
                // Check stock availability
                const products = db.products.getAll();
                for (const item of orderData.items) {
                    const product = products.find(p => p.id === item.productId);
                    
                    if (!product || product.stock < item.quantity) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            error: 'Insufficient stock', 
                            productId: item.productId 
                        }));
                        return;
                    }
                }
                
                // Create order
                const newOrder = db.orders.create(orderData);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newOrder));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request data' }));
            }
        });
        
        return;
    }
    
    if (pathname.startsWith('/api/orders') && req.method === 'GET') {
        // Get user orders
        const userId = query.userId ? parseInt(query.userId) : null;
        
        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User ID is required' }));
            return;
        }
        
        const orders = db.orders.getByUserId(userId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orders));
        return;
    }
    
    // API endpoint not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

// Serve error pages
function serveErrorPage(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${statusCode} - ${message}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f9f9f9;
                }
                h1 {
                    color: #3a7d44;
                }
                p {
                    margin-top: 20px;
                }
                a {
                    color: #3a7d44;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>${statusCode} - ${message}</h1>
            <p>Sorry, the page you are looking for might be unavailable or does not exist.</p>
            <p><a href="/">Return to homepage</a></p>
        </body>
        </html>
    `);
}

// Initialize database
initializeDatabase();

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});