import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, CardContent, Typography, CircularProgress, Alert } from "@mui/material";
import { setSubscription } from "../../redux/Subscription/action";
import _ from 'lodash';
const stripePromise = loadStripe("pk_test_51R4mpiJQe6DXzZU5W7VbrpXgv1sIEGbSuHCT0nBIoDFQVSUQSqMs9cyvt3ZdB4eqAiqLogTuODP5r71WyFSJx3rT00sEZ4jS3K");

const SubscriptionForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const subscriptionPrice = 3;

    const credentials = useSelector((state) => state.credentialReducer.credentials);
    const subscriptionData = useSelector((state) => state.subscriptionReducer.subscription);
    const email = credentials.email;

    const checkSubscription = async () => {
        setLoading(true);
        setMessage(null);
        if (!_.isEmpty(subscriptionData)) {
            setSubscription(subscriptionData?.subscriptionId ? subscriptionData : null);
            console.log(subscriptionData);
            setLoading(false);
        }
        else {
            try {
                const response = await fetch(`http://localhost:8082/stripeservice/api/subscription/check?email=${email}`);
                const data = await response.json();
                
                if (data.subscriptionId) {
                    console.log(data);
                    setSubscription(data);
                } else {
                    setSubscription(null);
                }
            } catch (error) {
                console.error("Ошибка при проверке подписки:", error);
                setMessage({ type: "error", text: "Ошибка при проверке подписки" });
            } finally {
                setLoading(false);
            }
        }
    };

    const cancelSubscription = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8082/stripeservice/api/subscription/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId: subscription.subscriptionId }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: "success", text: "Подписка будет отменена после окончания текущего периода." });

                setTimeout(() => {
                    setMessage(null);
                }, 4000);

                setSubscription((prev) => ({ ...prev, cancelAtPeriodEnd: true }));
            } else {
                throw new Error(data.error || "Не удалось отменить подписку.");
            }
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!stripe || !elements) {
            setMessage({ type: "error", text: "Ошибка Stripe" });
            return;
        }

        try {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(CardElement),
                billing_details: { email },
            });

            if (error) {
                throw new Error(error.message);
            }

            const response = await fetch("http://localhost:8082/stripeservice/api/subscription/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    paymentMethodId: paymentMethod.id,
                    priceId: "price_1R4omaJQe6DXzZU5rJShibQo",
                    userId: credentials.id,
                    months: 1,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Ошибка при создании подписки");
            }
            console.log(data);
            dispatch(setSubscription(data));
            setMessage({ type: "success", text: `Подписка оформлена!` });
            checkSubscription();
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email && subscriptionData) {
            checkSubscription();
        }
    }, [email, subscriptionData]);

    return (
        <Card sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 2, textAlign: "center" }}>
            <CardContent>
                <Typography variant="h5">
                    {subscription ? "Ваша подписка" : "Оформить подписку"}
                </Typography>

                {message && (
                    <Alert
                        severity={message.type}
                        sx={{
                            mb: 2,
                            position: "absolute",
                            left: 10,
                            bottom: 10,
                            width: "auto",
                            zIndex: 1000,
                            fontSize: 14,
                        }}
                    >
                        {message.text}
                    </Alert>
                )}

                {!subscription ? (
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Стоимость подписки: {subscriptionPrice}$
                        </Typography>

                        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}>
                            <CardElement />
                        </div>

                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Оформить подписку"}
                        </Button>
                    </form>
                ) : (
                    <>
                        {!subscription.cancelAtPeriodEnd && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Следующее списание средств для продления подписки: {new Date(subscription.endDate * 1000).toLocaleDateString()}
                            </Typography>
                        )}

                        {subscription.cancelAtPeriodEnd ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Подписка уже отменена и закончится {new Date(subscription.endDate * 1000).toLocaleDateString()}
                            </Alert>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={loading}
                                onClick={cancelSubscription}
                            >
                                {loading ? <CircularProgress size={24} /> : "Отменить подписку"}
                            </Button>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default function SubscriptionWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionForm />
        </Elements>
    );
}
