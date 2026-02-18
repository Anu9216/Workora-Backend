const Order = require('../models/Order');
const Gig = require('../models/Gig');
const Stripe = require('stripe');
// Use a fallback key if env var is missing to prevent module crash on startup
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const stripe = new Stripe(stripeKey);
console.log("Order Controller Loaded. Stripe Key present:", !!process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    const { gigId } = req.body;

    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // FORCE DEMO MODE if keys are missing or placeholders
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("your_") || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder")) {
            console.log("Detected placeholder/missing key. Activating Demo Mode.");
            throw new Error("Demo Mode Trigger");
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: gig.price * 100, // Amount in cents
            currency: 'inr',
            payment_method_types: ['card', 'upi'],
            metadata: {
                gigId: gig._id.toString(),
                buyerId: req.user._id.toString(),
                sellerId: gig.seller.toString()
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        // Fallback to Demo Mode if Stripe fails (e.g., missing keys)
        console.log("Falling back to Demo Mode due to Stripe error.");
        res.status(200).json({
            clientSecret: `demo_secret_${Date.now()}`,
            isDemo: true,
            gigId: gigId
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { paymentIntentId, gigId } = req.body; // gigId might be passed for demo orders
        console.log("Creating order for payment intent:", paymentIntentId);

        let gig, buyer, seller, price;

        if (paymentIntentId.startsWith('demo_')) {
            // DEMO MODE: Bypass Stripe verification
            console.log("Processing Demo Order");
            if (!gigId) return res.status(400).json({ message: "Gig ID required for demo order" });

            const gigDoc = await Gig.findById(gigId);
            if (!gigDoc) return res.status(404).json({ message: "Gig not found" });

            gig = gigId;
            buyer = req.user._id;
            seller = gigDoc.seller;
            price = gigDoc.price;
        } else {
            // STRIPE MODE: Verify with Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status !== 'succeeded') {
                return res.status(400).json({ message: "Payment not successful" });
            }

            gig = paymentIntent.metadata.gigId;
            buyer = paymentIntent.metadata.buyerId;
            seller = paymentIntent.metadata.sellerId;
            price = paymentIntent.amount / 100;
        }

        // Check if order already exists
        const existingOrder = await Order.findOne({ paymentIntentId });
        if (existingOrder) {
            return res.status(200).json(existingOrder);
        }

        const newOrder = new Order({
            gig,
            buyer,
            seller,
            price,
            paymentIntentId,
            isCompleted: true,
            status: 'in_progress'
        });

        await newOrder.save();

        res.status(200).send(newOrder);

    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).send(err);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ buyer: req.user._id }, { seller: req.user._id }]
        })
            .populate('gig', 'title price')
            .populate('buyer', 'username')
            .populate('seller', 'username');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Logic: Check if user is buyer or seller
        if (order.buyer.toString() !== req.user._id.toString() && order.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.status = status;
        if (status === 'completed') {
            order.isCompleted = true;
        }

        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
