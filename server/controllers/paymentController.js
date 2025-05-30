const dottie = require("dottie");
const stripe = require("../config/stripe");
const { Car, User } = require("../models");

class PaymentController {
  static async createCheckoutSession(req, res, next) {
    try {
      console.log("Request body:", req.body);
      console.log("Request params:", req.params);
      const { carId } = req.body;
      console.log("Extracted carId:", carId, "Type:", typeof carId);
      const userId = req.user.id;

      // Find the car
      const car = await Car.findByPk(carId, {
        include: [{ model: User, as: "wishlistingUsers" }],
      });

      if (!car) {
        throw { status: 404, message: "Car not found" };
      }

      // Validate price limit for Stripe IDR (max IDR 2,000,000,000)
      const maxStripeAmountIDR = 200000000000; // IDR 2,000,000,000 in sen
      const carPriceInSen = car.price * 100; // Convert IDR to sen

      if (carPriceInSen > maxStripeAmountIDR) {
        throw {
          status: 400,
          message: `Harga mobil (Rp ${car.price.toLocaleString(
            "id-ID"
          )}) melebihi batas maksimum Stripe IDR 2,000,000,000. Silakan hubungi support untuk metode pembayaran alternatif.`,
        };
      }

      // Validate minimum amount (Stripe IDR requires at least IDR 7,000)
      if (carPriceInSen < 700000) {
        // IDR 7,000 in sen
        throw {
          status: 400,
          message: "Harga mobil minimal IDR 7,000 untuk pemrosesan pembayaran.",
        };
      }

      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "idr",
              product_data: {
                name: `${car.brand} ${car.Type}`,
                description: `Fuel: ${car.fuel}, Year: ${car.released_year}`,
                ...(car.imageUrl &&
                  car.imageUrl.trim() !== "" && {
                    images: [car.imageUrl],
                  }),
              },
              unit_amount: carPriceInSen,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${"https://ip-dio.web.app"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${"https://ip-dio.web.app"}/?payment=cancelled`,
        metadata: {
          carId: car.id,
          userId: userId,
        },
      });

      res.status(200).json({ id: session.id, url: session.url });
    } catch (err) {
      next(err);
    }
  }

  static async handlePaymentSuccess(req, res, next) {
    try {
      const { session_id } = req.query;

      // Retrieve the session to get metadata
      const session = await stripe.checkout.sessions.retrieve(session_id);

      const { carId, userId } = session.metadata;

      // Remove the car from user's wishlist after successful payment
      const { WishlistItem } = require("../models");
      await WishlistItem.destroy({
        where: {
          CarId: carId,
          UserId: userId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Payment successful",
        data: {
          carId: session.metadata.carId,
          userId: session.metadata.userId,
          paymentId: session.payment_intent,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async handlePaymentWebhook(req, res, next) {
    const signature = req.headers["stripe-signature"];
    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      // Handle the event based on its type
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Process the payment - update database, send confirmation emails, etc.
        console.log("Payment completed for:", session.metadata);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}

module.exports = PaymentController;
