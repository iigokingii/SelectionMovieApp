package org.example.stripeservice.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.SubscriptionListParams;
import com.stripe.param.SubscriptionUpdateParams;
import org.example.stripeservice.Repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.example.stripeservice.Model.UserSubscription;

import java.util.*;

@Service
public class SubscriptionService {

    @Autowired UserSubscriptionRepository userSubscriptionRepository;

    public Map<String, Object> CreateSubscription(Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Создаем клиента в Stripe
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(request.get("email"))
                    .setPaymentMethod(request.get("paymentMethodId"))
                    .setInvoiceSettings(
                            CustomerCreateParams.InvoiceSettings.builder()
                                    .setDefaultPaymentMethod(request.get("paymentMethodId"))
                                    .build()
                    ).build();
            Customer customer = Customer.create(customerParams);

            // Создаем подписку в Stripe
            SubscriptionCreateParams subParams = SubscriptionCreateParams.builder()
                    .setCustomer(customer.getId())
                    .addItem(SubscriptionCreateParams.Item.builder()
                            .setPrice(request.get("priceId"))
                            .build())
                    .addExpand("latest_invoice.payment_intent")
                    .build();

            Subscription subscription = Subscription.create(subParams);

            // Сохраняем подписку в БД
            UserSubscription userSubscription = UserSubscription.builder()
                    .subscriptionId(subscription.getId())
                    .userId(Long.parseLong(request.get("userId")))
                    .cancelAtPeriodEnd(subscription.getCancelAtPeriodEnd())
                    .userEmail(request.get("email"))
                    .build();

            userSubscriptionRepository.save(userSubscription);

            response.put("subscriptionId", subscription.getId());
            response.put("clientSecret", subscription.getLatestInvoiceObject().getPaymentIntentObject().getClientSecret());
            response.put("endDate", subscription.getCurrentPeriodEnd());
        } catch (StripeException e) {
            response.put("error", e.getMessage());
        }
        return response;
    }

    public ResponseEntity<Map<String, Object>> CheckSubscription(String email){
        Optional<UserSubscription> userSubscriptionOpt = userSubscriptionRepository.findByUserEmail(email);

        if (!userSubscriptionOpt.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Подписка не найдена для данного пользователя");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        UserSubscription userSubscription = userSubscriptionOpt.get();
        Subscription stripeSubscription = null;

        try {
            stripeSubscription = Subscription.retrieve(userSubscription.getSubscriptionId());
        } catch (StripeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Ошибка при получении подписки: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        if (stripeSubscription == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Подписка не найдена на сервере Stripe");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("subscriptionId", stripeSubscription.getId());
        response.put("endDate", stripeSubscription.getCurrentPeriodEnd());
        response.put("cancelAtPeriodEnd", stripeSubscription.getCancelAtPeriodEnd());

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> CancelSubscription (Map<String, String> request){
        try {
            Subscription subscription = Subscription.retrieve(request.get("subscriptionId"));
            Subscription updatedSubscription = subscription.update(SubscriptionUpdateParams.builder()
                    .setCancelAtPeriodEnd(true)
                    .build());

            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    public Mono<Boolean> hasActiveSubscription(String customerId) {
        try {
            SubscriptionListParams params = SubscriptionListParams.builder()
                    .setCustomer(customerId)
                    .setStatus(SubscriptionListParams.Status.ACTIVE)
                    .build();

            List<Subscription> subscriptions = Subscription.list(params).getData();
            return Mono.just(!subscriptions.isEmpty());
        } catch (StripeException e) {
            return Mono.just(false);
        }
    }
}
