// N8N Webhook Integration Handler
// This file handles all webhook calls to n8n workflows

class N8NWebhookHandler {
    constructor() {
        // Replace these with your actual n8n webhook URLs
        this.webhooks = {
            // 1. ORDER PROCESSING & NOTIFICATIONS
            orderPlaced: 'https://your-n8n-instance.app.n8n.cloud/webhook/order-placed',
            orderStatusUpdate: 'https://your-n8n-instance.app.n8n.cloud/webhook/order-status',
            inventoryUpdate: 'https://your-n8n-instance.app.n8n.cloud/webhook/inventory-update',

            // 2. CUSTOMER MANAGEMENT
            userRegistration: 'https://your-n8n-instance.app.n8n.cloud/webhook/user-registration',
            newsletterSubscribe: 'https://your-n8n-instance.app.n8n.cloud/webhook/newsletter-subscribe',
            supportTicket: 'https://your-n8n-instance.app.n8n.cloud/webhook/support-ticket',
            abandonedCart: 'https://your-n8n-instance.app.n8n.cloud/webhook/abandoned-cart',

            // 3. ARTISAN DASHBOARD
            salesReport: 'https://your-n8n-instance.app.n8n.cloud/webhook/sales-report',
            lowStockAlert: 'https://your-n8n-instance.app.n8n.cloud/webhook/low-stock',
            newReview: 'https://your-n8n-instance.app.n8n.cloud/webhook/new-review',

            // 4. PAYMENT PROCESSING
            paymentConfirmation: 'https://your-n8n-instance.app.n8n.cloud/webhook/payment-confirmed',
            invoiceGeneration: 'https://your-n8n-instance.app.n8n.cloud/webhook/generate-invoice',
            refundProcessing: 'https://your-n8n-instance.app.n8n.cloud/webhook/process-refund',

            // 5. MARKETING AUTOMATION
            productLaunch: 'https://your-n8n-instance.app.n8n.cloud/webhook/product-launch',
            campaignTrigger: 'https://your-n8n-instance.app.n8n.cloud/webhook/campaign-trigger',
            socialPost: 'https://your-n8n-instance.app.n8n.cloud/webhook/social-post'
        };
    }

    // ============================================
    // 1. ORDER PROCESSING & NOTIFICATIONS
    // ============================================

    async triggerOrderPlaced(orderData) {
        const payload = {
            trigger: 'order_placed',
            timestamp: new Date().toISOString(),
            order: {
                orderId: orderData.orderId,
                orderNumber: orderData.orderNumber,
                customer: {
                    email: orderData.customerEmail,
                    name: orderData.customerName,
                    phone: orderData.customerPhone
                },
                artisan: {
                    email: orderData.artisanEmail,
                    name: orderData.artisanName,
                    shopName: orderData.shopName
                },
                items: orderData.items,
                totalAmount: orderData.totalAmount,
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod
            }
        };

        return await this.sendWebhook(this.webhooks.orderPlaced, payload);
    }

    async triggerOrderStatusUpdate(orderData) {
        const payload = {
            trigger: 'order_status_update',
            timestamp: new Date().toISOString(),
            orderId: orderData.orderId,
            orderNumber: orderData.orderNumber,
            previousStatus: orderData.previousStatus,
            newStatus: orderData.newStatus,
            trackingNumber: orderData.trackingNumber,
            customerEmail: orderData.customerEmail,
            customerName: orderData.customerName
        };

        return await this.sendWebhook(this.webhooks.orderStatusUpdate, payload);
    }

    async triggerInventoryUpdate(productData) {
        const payload = {
            trigger: 'inventory_update',
            timestamp: new Date().toISOString(),
            product: {
                productId: productData.productId,
                title: productData.title,
                previousStock: productData.previousStock,
                newStock: productData.newStock,
                changeType: productData.changeType, // 'sale', 'restock', 'adjustment'
                artisanEmail: productData.artisanEmail
            }
        };

        return await this.sendWebhook(this.webhooks.inventoryUpdate, payload);
    }

    // ============================================
    // 2. CUSTOMER MANAGEMENT
    // ============================================

    async triggerUserRegistration(userData) {
        const payload = {
            trigger: 'user_registration',
            timestamp: new Date().toISOString(),
            user: {
                userId: userData.userId,
                email: userData.email,
                fullName: userData.fullName,
                userType: userData.userType, // 'customer' or 'artisan'
                newsletterSubscribed: userData.newsletterSubscribed
            }
        };

        return await this.sendWebhook(this.webhooks.userRegistration, payload);
    }

    async triggerNewsletterSubscribe(subscriberData) {
        const payload = {
            trigger: 'newsletter_subscribe',
            timestamp: new Date().toISOString(),
            subscriber: {
                email: subscriberData.email,
                name: subscriberData.name,
                source: subscriberData.source // 'signup', 'footer', 'checkout'
            }
        };

        return await this.sendWebhook(this.webhooks.newsletterSubscribe, payload);
    }

    async triggerSupportTicket(ticketData) {
        const payload = {
            trigger: 'support_ticket_created',
            timestamp: new Date().toISOString(),
            ticket: {
                ticketId: ticketData.ticketId,
                ticketNumber: ticketData.ticketNumber,
                userEmail: ticketData.userEmail,
                userName: ticketData.userName,
                subject: ticketData.subject,
                message: ticketData.message,
                priority: ticketData.priority
            }
        };

        return await this.sendWebhook(this.webhooks.supportTicket, payload);
    }

    async triggerAbandonedCart(cartData) {
        const payload = {
            trigger: 'abandoned_cart',
            timestamp: new Date().toISOString(),
            cart: {
                cartId: cartData.cartId,
                userEmail: cartData.userEmail,
                userName: cartData.userName,
                items: cartData.items,
                totalValue: cartData.totalValue,
                abandonedAt: cartData.abandonedAt,
                cartUrl: `${window.location.origin}/cart?id=${cartData.cartId}`
            }
        };

        return await this.sendWebhook(this.webhooks.abandonedCart, payload);
    }

    // ============================================
    // 3. ARTISAN DASHBOARD
    // ============================================

    async triggerSalesReport(reportData) {
        const payload = {
            trigger: 'sales_report',
            timestamp: new Date().toISOString(),
            report: {
                artisanId: reportData.artisanId,
                artisanEmail: reportData.artisanEmail,
                artisanName: reportData.artisanName,
                period: reportData.period, // 'daily', 'weekly', 'monthly'
                periodStart: reportData.periodStart,
                periodEnd: reportData.periodEnd,
                totalSales: reportData.totalSales,
                totalOrders: reportData.totalOrders,
                totalRevenue: reportData.totalRevenue,
                topProducts: reportData.topProducts,
                reportUrl: reportData.reportUrl
            }
        };

        return await this.sendWebhook(this.webhooks.salesReport, payload);
    }

    async triggerLowStockAlert(productData) {
        const payload = {
            trigger: 'low_stock_alert',
            timestamp: new Date().toISOString(),
            product: {
                productId: productData.productId,
                title: productData.title,
                currentStock: productData.currentStock,
                threshold: productData.threshold,
                artisanEmail: productData.artisanEmail,
                artisanName: productData.artisanName,
                productUrl: `${window.location.origin}/product-detail.html?id=${productData.productId}`
            }
        };

        return await this.sendWebhook(this.webhooks.lowStockAlert, payload);
    }

    async triggerNewReview(reviewData) {
        const payload = {
            trigger: 'new_review',
            timestamp: new Date().toISOString(),
            review: {
                reviewId: reviewData.reviewId,
                productId: reviewData.productId,
                productTitle: reviewData.productTitle,
                rating: reviewData.rating,
                reviewText: reviewData.reviewText,
                customerName: reviewData.customerName,
                artisanEmail: reviewData.artisanEmail,
                artisanName: reviewData.artisanName,
                isVerifiedPurchase: reviewData.isVerifiedPurchase
            }
        };

        return await this.sendWebhook(this.webhooks.newReview, payload);
    }

    // ============================================
    // 4. PAYMENT PROCESSING
    // ============================================

    async triggerPaymentConfirmation(paymentData) {
        const payload = {
            trigger: 'payment_confirmed',
            timestamp: new Date().toISOString(),
            payment: {
                paymentId: paymentData.paymentId,
                orderId: paymentData.orderId,
                orderNumber: paymentData.orderNumber,
                amount: paymentData.amount,
                paymentMethod: paymentData.paymentMethod,
                transactionId: paymentData.transactionId,
                customerEmail: paymentData.customerEmail,
                customerName: paymentData.customerName
            }
        };

        return await this.sendWebhook(this.webhooks.paymentConfirmation, payload);
    }

    async triggerInvoiceGeneration(invoiceData) {
        const payload = {
            trigger: 'generate_invoice',
            timestamp: new Date().toISOString(),
            invoice: {
                orderId: invoiceData.orderId,
                orderNumber: invoiceData.orderNumber,
                customerEmail: invoiceData.customerEmail,
                customerName: invoiceData.customerName,
                items: invoiceData.items,
                totalAmount: invoiceData.totalAmount,
                billingAddress: invoiceData.billingAddress
            }
        };

        return await this.sendWebhook(this.webhooks.invoiceGeneration, payload);
    }

    async triggerRefundProcessing(refundData) {
        const payload = {
            trigger: 'process_refund',
            timestamp: new Date().toISOString(),
            refund: {
                orderId: refundData.orderId,
                orderNumber: refundData.orderNumber,
                refundAmount: refundData.refundAmount,
                reason: refundData.reason,
                customerEmail: refundData.customerEmail,
                customerName: refundData.customerName,
                originalTransactionId: refundData.originalTransactionId
            }
        };

        return await this.sendWebhook(this.webhooks.refundProcessing, payload);
    }

    // ============================================
    // 5. MARKETING AUTOMATION
    // ============================================

    async triggerProductLaunch(productData) {
        const payload = {
            trigger: 'product_launch',
            timestamp: new Date().toISOString(),
            product: {
                productId: productData.productId,
                title: productData.title,
                description: productData.description,
                price: productData.price,
                images: productData.images,
                artisanName: productData.artisanName,
                shopName: productData.shopName,
                productUrl: `${window.location.origin}/product-detail.html?id=${productData.productId}`,
                launchDate: productData.launchDate
            }
        };

        return await this.sendWebhook(this.webhooks.productLaunch, payload);
    }

    async triggerCampaign(campaignData) {
        const payload = {
            trigger: 'campaign_trigger',
            timestamp: new Date().toISOString(),
            campaign: {
                campaignId: campaignData.campaignId,
                campaignName: campaignData.campaignName,
                campaignType: campaignData.campaignType, // 'email', 'social', 'promotion'
                subject: campaignData.subject,
                content: campaignData.content,
                targetAudience: campaignData.targetAudience,
                scheduledAt: campaignData.scheduledAt
            }
        };

        return await this.sendWebhook(this.webhooks.campaignTrigger, payload);
    }

    async triggerSocialPost(postData) {
        const payload = {
            trigger: 'social_post',
            timestamp: new Date().toISOString(),
            post: {
                platform: postData.platform, // 'instagram', 'facebook', 'twitter'
                content: postData.content,
                images: postData.images,
                hashtags: postData.hashtags,
                link: postData.link,
                scheduledAt: postData.scheduledAt
            }
        };

        return await this.sendWebhook(this.webhooks.socialPost, payload);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    async sendWebhook(url, payload) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Webhook failed: ${response.statusText}`);
            }

            const result = await response.json();

            // Log automation execution
            this.logAutomation(payload.trigger, 'success', result);

            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Webhook error:', error);

            // Log automation failure
            this.logAutomation(payload.trigger, 'failed', error.message);

            return {
                success: false,
                error: error.message
            };
        }
    }

    logAutomation(trigger, status, details) {
        // This would typically save to your database
        console.log('Automation Log:', {
            trigger,
            status,
            details,
            timestamp: new Date().toISOString()
        });

        // In production, send this to your backend API to save in automation_logs table
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = N8NWebhookHandler;
}
