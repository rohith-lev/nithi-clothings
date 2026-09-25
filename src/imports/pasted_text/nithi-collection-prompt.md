NITHI COLLECTION – COMPLETE E-COMMERCE WEBSITE DEVELOPMENT MASTER PROMPT

Build a complete, premium, modern, mobile-first fashion e-commerce website for Nithi Collection, inspired by the overall shopping experience, information architecture and usability patterns of premium Indian fashion e-commerce websites such as Joymol Couture.

IMPORTANT:
Do NOT create an exact copy of Joymol Couture.
Use it only as UX/business-flow inspiration.
Create a unique Nithi Collection brand identity, UI, layout, typography, components and content.

The website must be production-ready, responsive, secure and scalable, with both:

1. CUSTOMER-FACING E-COMMERCE WEBSITE
2. ADMIN / BACKEND MANAGEMENT PANEL

⸻

1. BRAND

⸻

Brand Name:
Nithi Collection

Industry:
Women’s Fashion / Online Clothing Store

Main objective:
Sell women’s fashion products online with a smooth shopping experience from product discovery → cart → shipping calculation → payment/COD → order confirmation → tracking.

Design should feel:

* Premium
* Elegant
* Feminine
* Modern
* Trustworthy
* Clean
* Fashion-focused
* Mobile-first
* Easy for first-time customers

Do NOT make the website look like a generic template.

Create a strong visual identity for Nithi Collection.

⸻

2. PRODUCT CATEGORIES

⸻

Create these main categories:

1. Nighty
2. Night Dress
3. Unstitched Salwar Material
4. Cord Set
5. Kurtis / Tops
6. Salwar Set
7. Maxi

Nighty subcategories:

* Normal Nighty – 55 inches
    * Zip Nighty
    * Zipless Nighty
    * Titanic Model Nighty
    * Collar Model Nighty
    * Elastic Model Nighty
* 60 Inch Nighty
    * Zip Nighty
    * Zipless Nighty
    * Collar Nighty
    * Non-Feeding Frock Model
* Frock Model – 55 inches
    * Feeding Frock Model
    * Non-Feeding Frock Model
* Maternity Wear
    * Long Zip Nighty
    * Double Side Vertical Zip
    * Full Open Nighty
* Smocking Nighty

These categories and product types must be manageable from the admin panel.

⸻

3. WEBSITE PAGES

⸻

Create the following pages:

HOME
SHOP / ALL PRODUCTS
CATEGORY PAGES
PRODUCT DETAILS
SEARCH RESULTS
CART
CHECKOUT
ORDER SUCCESS
ORDER TRACKING
MY ACCOUNT
MY ORDERS
WISHLIST
ABOUT US
CONTACT US
SHIPPING POLICY
RETURN / REFUND POLICY
PRIVACY POLICY
TERMS & CONDITIONS
FAQ

⸻

4. HOMEPAGE UX

⸻

Create a premium fashion homepage.

Header:

* Nithi Collection logo
* Home
* Shop
* Categories
* New Arrivals
* Best Sellers
* Offers
* Search icon
* Wishlist icon
* Account icon
* Cart icon

Mobile:

Use a clean mobile navigation drawer / bottom navigation where appropriate.

Hero section:

Large fashion banner with:

“Discover Your Everyday Elegance”

CTA:
“Shop Now”

Add secondary promotional banners for:

* New Arrivals
* Best Sellers
* Special Offers
* Combo Deals

Create visually attractive category cards.

Example:

Nighty
Kurtis
Salwar Sets
Cord Sets
Maxi
Unstitched Salwar

⸻

5. PRODUCT LISTING PAGE

⸻

Create a professional fashion catalog.

Each product card should contain:

* Product image
* Product name
* Product code
* Current price
* Original price
* Discount percentage
* Sale badge
* Wishlist button
* Quick View
* Add to Cart
* Stock status

Filters:

* Category
* Price
* Size
* Colour
* Availability
* Product type
* Fabric
* Collection

Sorting:

* Featured
* Newest
* Price Low → High
* Price High → Low
* Best Selling
* Discount

Use pagination or infinite scrolling depending on performance.

⸻

6. PRODUCT DETAIL PAGE

⸻

Create a premium product detail page.

Left:

* Multiple product images
* Zoom
* Thumbnail gallery
* Mobile swipe gallery

Right:

* Product name
* Product code
* Rating/reviews
* Current price
* MRP
* Discount
* Available colours
* Available sizes
* Quantity selector
* Stock status

Buttons:

ADD TO CART
BUY NOW
ADD TO WISHLIST

Information sections:

* Product Description
* Fabric
* Size / Measurements
* Care Instructions
* Delivery Information
* Return / Exchange Policy

Show:

“Check Delivery Availability”

Customer enters pincode and website displays delivery availability/message.

⸻

7. CART SYSTEM

⸻

Cart must dynamically calculate:

* Product subtotal
* Quantity
* Discounts
* Shipping charge
* COD charge / advance
* Final payable amount

Cart should automatically check the customer’s selected state and product combination.

Important:

Shipping eligibility must be calculated by backend rules, not manually by frontend.

Show a clear message such as:

“🎉 You are eligible for FREE SHIPPING”

or

“Add 1 more item to unlock FREE SHIPPING”

This should update dynamically whenever quantity/product changes.

⸻

8. SHIPPING RULE ENGINE

⸻

Implement a configurable shipping rules engine.

Do NOT hard-code shipping logic inside frontend components.

Store rules in backend/database so admin can change them later.

ONLINE PAYMENT RULES:

UNSTITCHED SALWAR SUIT / SALWAR SET:

Tamil Nadu:

* Single set → Free Shipping
* Buy 2 or more → Free Shipping

Andhra Pradesh / Telangana / Kerala / Karnataka:

* Single set → ₹50 shipping
* Buy 2 or more → Free Shipping

Other states:

* Single set → ₹70 shipping
* Every additional set → ₹40 extra

Example:
2 sets = ₹70 + ₹40
3 sets = ₹70 + ₹40 + ₹40

NIGHTY:

Tamil Nadu:

* Buy any 3 → Free Shipping
* Buy 5 or more → ₹15 discount per nighty + Free Shipping

CORD SET:

Tamil Nadu:

* Buy any 2 → Free Shipping

KURTIS / TOPS:

Tamil Nadu:

* Buy any 3 → Free Shipping

COMBO SHIPPING RULE:

If ANY eligible product/category combination makes the order eligible for free shipping, apply free shipping to the complete eligible combination according to the configured business rules.

Example:
1 Unstitched Salwar Set + 1 Nighty → Free Shipping in Tamil Nadu.

Make this logic configurable.

⸻

9. CASH ON DELIVERY

⸻

COD is currently available only within Tamil Nadu.

COD rules:

UNSTITCHED SALWAR SUIT / SALWAR SET:

* 1 set → ₹70 extra
* 2 or more → Free Shipping

NIGHTY:

* 1 or 2 → COD not available if only nighties are selected
* Minimum 3 nighties required
* 3 nighties → ₹70 shipping
* 5 or more → Free Shipping

CORD SET:

* 2 or 3 → ₹70 shipping
* 4 or more → Free Shipping

KURTIS:

* Buy 5 → Free Shipping

COD COMBO:

Use the same combo/free-shipping logic as online payment where applicable.

If COD is otherwise not eligible but total order value is ₹2,000 or above:

→ Free Shipping for COD.

Example:

1 Salwar Set + 2 Nighties + 2 Cord Sets

If total order value is ₹2,000 or above:
→ COD free shipping.

⸻

10. COD ADVANCE PAYMENT

⸻

Create a configurable COD advance-payment system.

UNSTITCHED SALWAR:

* 2 sets → ₹100 advance
* Up to 5 sets → ₹160 advance
* For every additional 2 sets → ₹30 extra

NIGHTY:

* 3 nighties → ₹100 advance
* 4–6 nighties → ₹130 advance
* Every additional 3 nighties → ₹30 extra

The system must automatically calculate the required COD advance.

At checkout display:

Order Total
COD Advance
Remaining Amount Payable on Delivery

Example:

Order Total: ₹1,500
COD Advance: ₹100
Balance on Delivery: ₹1,400

Admin should be able to change these rules without changing source code.

⸻

11. CHECKOUT

⸻

Create a simple 3-step checkout.

STEP 1:
Customer Information

* Full Name
* Mobile Number
* Email
* Address
* Landmark
* City
* State
* Pincode

STEP 2:
Delivery & Payment

Payment options:

* Online Payment
* Cash on Delivery

Show only eligible payment options based on:

* State
* Product combination
* Quantity
* Order value
* COD eligibility

STEP 3:
Order Review

Display:

* Products
* Quantity
* Subtotal
* Discount
* Shipping
* COD advance
* Total
* Payment method
* Delivery address

Button:

“PLACE ORDER”

⸻

12. PAYMENT GATEWAY

⸻

Integrate a secure Indian payment gateway such as:

* Razorpay

Architecture should allow replacing it later with:

* Cashfree
* PayU
* PhonePe Payment Gateway

Support:

* UPI
* Credit Card
* Debit Card
* Net Banking
* Wallets where supported

IMPORTANT SECURITY REQUIREMENTS:

Never store card numbers, CVV or sensitive payment credentials.

Use gateway-hosted secure payment processing.

Payment flow:

Customer → Checkout → Backend creates payment/order → Payment Gateway → Customer completes payment → Gateway webhook → Backend verifies payment signature → Order status becomes PAID → Confirmation sent to customer.

Do NOT trust only frontend payment success.

Verify payment server-side using webhook/signature verification.

Handle:

* Successful payment
* Failed payment
* Cancelled payment
* Pending payment
* Duplicate webhook
* Payment timeout
* Refund

⸻

13. ORDER MANAGEMENT

⸻

Create order lifecycle:

PENDING
PAYMENT_PENDING
PAID
CONFIRMED
PROCESSING
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
RETURN_REQUESTED
RETURNED
REFUNDED

Every order should have:

* Unique Order ID
* Customer details
* Products
* Quantity
* Price
* Discount
* Shipping
* Payment method
* Payment status
* Order status
* Tracking number
* Courier
* Order date
* Delivery address

⸻

14. ADMIN DASHBOARD

⸻

Create a complete admin panel.

Dashboard cards:

* Today’s Orders
* Today’s Sales
* Pending Orders
* Processing Orders
* Shipped Orders
* Delivered Orders
* Cancelled Orders
* COD Orders
* Online Orders
* Low Stock Products

Charts:

* Daily sales
* Monthly sales
* Orders by category
* Online vs COD
* Top-selling products

⸻

15. PRODUCT MANAGEMENT

⸻

Admin can:

* Add product
* Edit product
* Delete product
* Publish/unpublish product
* Add product images
* Set price
* Set MRP
* Set discount
* Set stock
* Set SKU
* Set product category
* Set subcategory
* Set size
* Set colour
* Add description
* Add measurements
* Add fabric
* Add care instructions

Bulk product upload using Excel/CSV should be supported.

⸻

16. INVENTORY MANAGEMENT

⸻

Track:

* Available stock
* Reserved stock
* Sold stock
* Low stock
* Out of stock

When an order is successfully placed:

Reserve stock.

When payment is confirmed:

Convert reservation into sale.

If payment fails/cancels:

Release reserved stock.

Prevent overselling using backend/database transaction logic.

⸻

17. CUSTOMER ACCOUNT

⸻

Customers can:

* Register
* Login
* OTP/mobile login if implemented
* View profile
* Save addresses
* View orders
* Track orders
* Cancel eligible orders
* Request return/exchange
* View wishlist
* Reorder products

Guest checkout should also be supported.

⸻

18. SEARCH

⸻

Create fast product search.

Search by:

* Product name
* SKU
* Category
* Product code
* Colour
* Fabric

Show:

* Search suggestions
* Popular searches
* Recent searches
* No-result recommendations

⸻

19. WISHLIST

⸻

Customer can add/remove products from wishlist.

Wishlist should work for both logged-in customers and temporary guest sessions.

⸻

20. COUPON / OFFER ENGINE

⸻

Create admin-controlled coupon system.

Coupon types:

* Percentage discount
* Fixed discount
* Category discount
* Product-specific discount
* Minimum order value
* First-order coupon
* Expiry date
* Usage limit
* Customer-specific coupon

Do not allow invalid/expired coupons.

⸻

21. NOTIFICATIONS

⸻

After order:

Send:

* Order confirmation
* Payment confirmation
* Order packed
* Order shipped
* Tracking information
* Delivered notification

Channels:

* Email
* WhatsApp/SMS integration-ready

Keep notification providers configurable.

⸻

22. WHATSAPP INTEGRATION

⸻

Add WhatsApp support.

Buttons:

“Chat with us on WhatsApp”

“Need help with your order?”

For order-related WhatsApp:

Generate structured message containing:

Order ID
Customer Name
Order Status
Total Amount

Admin should be able to configure WhatsApp number.

⸻

23. SHIPPING / COURIER INTEGRATION

⸻

Build architecture ready for courier/shipping APIs.

Possible integrations:

* Shiprocket
* Delhivery
* DTDC
* Other courier APIs

System should support:

* Create shipment
* Generate AWB
* Courier selection
* Tracking number
* Shipment status
* Tracking URL
* Delivery status webhook

Admin should be able to manually enter tracking details if API integration is not available.

⸻

24. RETURN / REFUND SYSTEM

⸻

Create admin-controlled return/refund workflow.

Customer can request return based on configured policy.

Return request fields:

* Order
* Product
* Reason
* Description
* Images
* Video upload if required

Admin actions:

APPROVE
REJECT
REQUEST MORE INFORMATION
REFUND
EXCHANGE

Refund should connect to original payment transaction where supported.

⸻

25. DATABASE

⸻

Design a scalable relational database.

Main tables/entities:

users
customers
admins
addresses
products
product_categories
product_subcategories
product_images
product_variants
inventory
carts
cart_items
wishlists
wishlist_items
orders
order_items
payments
payment_transactions
shipping_rules
cod_rules
shipping_zones
coupons
coupon_usage
shipments
returns
refunds
notifications
reviews
settings
audit_logs

Use proper relationships, indexes and constraints.

⸻

26. BACKEND API

⸻

Create secure REST API or equivalent backend architecture.

Example:

POST /api/auth/register
POST /api/auth/login
GET /api/products
GET /api/products/:id
GET /api/categories
POST /api/cart
PUT /api/cart/:id
DELETE /api/cart/:id
POST /api/checkout
POST /api/payment/create
POST /api/payment/webhook
POST /api/orders
GET /api/orders/:id
POST /api/orders/:id/cancel
POST /api/returns
GET /api/shipping/calculate
GET /api/admin/orders
POST /api/admin/products
PUT /api/admin/products/:id

Validate every request on the backend.

Never trust frontend price, shipping or discount calculations.

The backend must recalculate:

* Product price
* Discount
* Shipping
* COD eligibility
* COD advance
* Coupon
* Final total

before creating an order.

⸻

27. SECURITY

⸻

Implement:

* HTTPS
* Secure authentication
* Password hashing
* JWT/session security
* Role-based access control
* Admin authorization
* Input validation
* Rate limiting
* CSRF protection where applicable
* SQL injection protection
* XSS protection
* Secure file upload validation
* Payment signature verification
* Webhook verification
* Audit logs
* Secure environment variables

Never expose:

* Payment gateway secret keys
* Database passwords
* API secrets
* Admin credentials

in frontend code.

⸻

28. ADMIN ROLES

⸻

Create role-based admin access.

SUPER ADMIN:
Full access.

PRODUCT MANAGER:
Products + inventory.

ORDER MANAGER:
Orders + shipping.

CUSTOMER SUPPORT:
Customers + support tickets.

CONTENT MANAGER:
Banners + pages + offers.

FINANCE:
Payments + refunds + reports.

Each role must have permission-based access.

⸻

29. ANALYTICS

⸻

Admin analytics:

* Revenue
* Orders
* Average order value
* Conversion rate
* Best-selling products
* Best categories
* Repeat customers
* COD percentage
* Online payment percentage
* Cancellation rate
* Return rate

Integrate Google Analytics / Meta Pixel architecture.

⸻

30. SEO

⸻

Every product/category page must support:

* SEO title
* Meta description
* SEO keywords
* Canonical URL
* Open Graph image
* Structured data
* Product schema
* Breadcrumb schema

Create SEO-friendly URLs.

Example:

/collections/nighty
/products/cotton-zip-nighty
/products/premium-salwar-set

Generate sitemap.xml and robots.txt.

⸻

31. PERFORMANCE

⸻

Optimize for:

* Mobile
* Low bandwidth
* Fast loading
* Image compression
* Lazy loading
* WebP/AVIF images
* CDN-ready architecture
* Caching
* Database indexing

Target:

Google Lighthouse Performance 90+ where practical.

⸻

32. UI / UX DESIGN SYSTEM

⸻

Use a premium fashion aesthetic.

Design principles:

* Large product photography
* Clean whitespace
* Elegant typography
* Minimal UI
* Smooth micro-interactions
* Rounded but sophisticated cards
* Clear CTA buttons
* Premium product grids
* Sticky mobile cart/checkout CTA where useful

Do not overuse animations.

Animations should be subtle:

* Fade
* Slide
* Hover
* Image zoom
* Cart feedback
* Loading skeletons

Use responsive layouts for:

Mobile
Tablet
Laptop
Desktop

⸻

33. MOBILE EXPERIENCE

⸻

Mobile-first design is mandatory.

Mobile navigation:

Home
Shop
Search
Wishlist
Cart
Account

Checkout should be extremely simple.

Avoid unnecessary fields.

Product images should be swipeable.

Buttons should be thumb-friendly.

⸻

34. ADMIN SHIPPING RULE CONFIGURATION

⸻

IMPORTANT:

Create a visual Shipping Rule Manager.

Admin can create:

Condition:
State
Category
Quantity
Order value
Payment method

Action:
Free Shipping
Fixed Shipping
Additional Per Item
COD Available
COD Not Available
COD Advance Required

Example rule:

IF
State = Tamil Nadu
AND
Category = Nighty
AND
Quantity >= 3

THEN
Shipping = FREE

Admin must be able to add/edit/delete rules.

Use rule priority to resolve conflicts.

⸻

35. CHECKOUT CALCULATION ENGINE

⸻

Create a backend function:

calculateCheckout(cart, customerAddress, paymentMethod)

Return:

{
subtotal,
discount,
shippingCharge,
codCharge,
codAdvance,
grandTotal,
paymentAmount,
remainingAmount,
freeShipping,
codAvailable,
messages
}

This function must be the single source of truth for checkout calculations.

Frontend only displays backend result.

⸻

36. ORDER CONFIRMATION

⸻

After successful order:

Show beautiful confirmation page:

“Thank you for shopping with Nithi Collection!”

Display:

Order ID
Payment status
Total amount
Delivery address
Estimated delivery
Track Order button
Continue Shopping button

Also send confirmation notification.

⸻

37. ERROR STATES

⸻

Design proper UI for:

* Product unavailable
* Out of stock
* Payment failed
* Payment pending
* Coupon invalid
* COD unavailable
* Invalid pincode
* Network error
* Session expired
* Empty cart
* Empty wishlist
* No search results

Never show raw backend errors to customers.

⸻

38. DEPLOYMENT ARCHITECTURE

⸻

Create production-ready architecture.

Frontend:
Modern responsive framework.

Backend:
Secure API server.

Database:
PostgreSQL / MySQL.

Storage:
Cloud object storage for product images.

Deployment:

Frontend → CDN / Vercel / equivalent
Backend → Cloud server
Database → Managed database
Images → Cloud storage/CDN

Environment variables:

DATABASE_URL
PAYMENT_KEY
PAYMENT_SECRET
JWT_SECRET
EMAIL_API_KEY
WHATSAPP_API_KEY
SHIPPING_API_KEY

Never commit .env files.

⸻

39. ADMIN SETTINGS

⸻

Create Settings section:

Store Details
Logo
Contact Number
WhatsApp Number
Email
Address
GST details
Payment Gateway
Shipping
COD
Taxes
Coupons
Notifications
SEO
Social Media
Return Policy
Privacy Policy
Terms

Everything that may change frequently should be configurable from admin.

⸻

40. FINAL CUSTOMER FLOW

⸻

Customer Journey:

HOME
↓
CATEGORY
↓
PRODUCT
↓
ADD TO CART
↓
CART
↓
ENTER ADDRESS
↓
SYSTEM CALCULATES SHIPPING
↓
SYSTEM CHECKS COD ELIGIBILITY
↓
SYSTEM CALCULATES COD ADVANCE
↓
SELECT PAYMENT
↓
ONLINE PAYMENT / COD
↓
ORDER CREATED
↓
PAYMENT VERIFIED
↓
ORDER CONFIRMED
↓
PACKED
↓
SHIPPED
↓
TRACKING
↓
DELIVERED

⸻

41. FINAL ADMIN FLOW

⸻

ADMIN LOGIN
↓
DASHBOARD
↓
PRODUCT MANAGEMENT
↓
INVENTORY
↓
ORDERS
↓
PAYMENTS
↓
SHIPPING
↓
CUSTOMERS
↓
COUPONS
↓
RETURNS / REFUNDS
↓
REPORTS
↓
SETTINGS

⸻

42. DEVELOPMENT REQUIREMENT

⸻

Before coding:

1. Create sitemap.
2. Create database ER diagram.
3. Create API architecture.
4. Create checkout calculation flow.
5. Create shipping-rule engine.
6. Create payment flow.
7. Create admin permission system.
8. Create UI design system.
9. Then implement frontend.
10. Then backend.
11. Then database.
12. Then payment integration.
13. Then shipping integration.
14. Then testing.
15. Then production deployment.

Do not build only a static frontend.

This must be a real functional e-commerce application with a working backend, database, admin panel, payment integration architecture, inventory system, order management and configurable shipping/COD rules.

⸻

43. IMPORTANT BUSINESS RULE

⸻

The business rules supplied in the Nithi Collection requirements document are the source of truth for shipping and COD calculations.

Do not randomly change the pricing or shipping rules.

Keep these rules configurable so the business owner can change them later from Admin Settings.

⸻

44. DESIGN QUALITY

⸻

The final result must look like a professionally designed Indian fashion brand website, not an AI-generated template.

Prioritize:

Premium visuals
Excellent product photography
Strong typography
Simple navigation
Fast checkout
Clear pricing
Trust signals
Mobile usability
Conversion-focused UX

Use Joymol Couture only as inspiration for e-commerce information architecture and shopping flow.

Create a UNIQUE Nithi Collection design.

⸻

45. DELIVERABLE

⸻

Provide:

1. Complete frontend
2. Complete backend
3. Database schema
4. Admin dashboard
5. Authentication
6. Product management
7. Inventory management
8. Cart
9. Wishlist
10. Checkout
11. Shipping calculation engine
12. COD calculation engine
13. Payment gateway integration
14. Order management
15. Coupon system
16. Customer account
17. Notifications
18. Shipping/tracking architecture
19. Return/refund workflow
20. SEO
21. Analytics
22. Security
23. Responsive UI
24. Deployment configuration
25. API documentation

The website must be production-ready and scalable.

Do not stop at UI mockups.

Build the complete functional architecture.