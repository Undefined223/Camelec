// emailService.js
const { transporter } = require('../utils/transporter');

const sendOrderConfirmationEmail = async (user, order) => {
    const orderItemsHtml = order.orderItems.map(item => `
        <tr>
        <td>${item.product.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toFixed(2)} TND</td>
        <td>${(item.quantity * item.price).toFixed(2)} TND</td>
        </tr>
    `).join('');

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .header {
                text-align: center;
                padding-bottom: 20px;
            }
    
          
    
            .header h1 {
                margin: 0;
                color: #2c3e50;
            }
    
            .order-details {
                margin-bottom: 20px;
            }
    
            .order-details h2 {
                margin-top: 0;
                color: #2c3e50;
            }
    
            .order-details p {
                line-height: 1.6;
            }
    
            .order-items {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
    
            .order-items th,
            .order-items td {
                padding: 12px;
                border: 1px solid #dddddd;
                text-align: left;
            }
    
            .order-items th {
                background-color: #f4f4f4;
                color: #2c3e50;
            }
    
            .order-summary {
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 8px;
                text-align: center;
            }
    
            .order-summary p {
                margin: 0;
                line-height: 1.6;
                color: #7f8c8d;
            }
    
            .order-summary h3 {
                margin: 0;
                color: #2c3e50;
            }
    
            .footer {
                text-align: center;
                padding-top: 20px;
                color: #7f8c8d;
                font-size: 12px;
            }
    
            .footer a {
                color: #3498db;
                text-decoration: none;
            }
    
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <h1>Thank You for Your Order!</h1>
            </div>
    
            <div class="order-details">
                <h2>Order Confirmation</h2>
                <p>Hi ${user.name},</p>
                <p>Thank you for shopping with us. Your order has been successfully placed. Below are the details of your
                    order:</p>
                <p><strong>Order Number:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
    
            <table class="order-items">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
            </table>
    
            <div class="order-summary">
                <h3>Order Summary</h3>
                <p><strong>Shipping:</strong> ${(order.shippingPrice).toFixed(2) / 1000} TND</p>
                <p><strong>Total:</strong> ${(order.totalPrice).toFixed(2) / 1000} TND</p>
            </div>
    
            <div class="footer">
                &copy; 2024 InfoPlus. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>`;

    await transporter.sendMail({
        from: 'Info-Plus Ecommerce <infoplusgrb@gmail.com>', 
        to: user.email,
        subject: 'Order Confirmation',
        html: emailHtml,
    });
};

module.exports = { sendOrderConfirmationEmail };
