package org.example.stripeservice.Service;

import com.gokin.authservice.Model.User;
import com.gokin.authservice.Repository.UserRepository;
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

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SubscriptionService {

    @Autowired UserSubscriptionRepository userSubscriptionRepository;
    @Autowired private UserRepository userRepository;

    private static final int MAX_FREE_REQUESTS = 5;
    private static final int RESET_INTERVAL_HOURS = 24;

    public Map<String, Object> CreateSubscription(Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(request.get("email"))
                    .setPaymentMethod(request.get("paymentMethodId"))
                    .setInvoiceSettings(
                            CustomerCreateParams.InvoiceSettings.builder()
                                    .setDefaultPaymentMethod(request.get("paymentMethodId"))
                                    .build()
                    ).build();
            Customer customer = Customer.create(customerParams);

            SubscriptionCreateParams subParams = SubscriptionCreateParams.builder()
                    .setCustomer(customer.getId())
                    .addItem(SubscriptionCreateParams.Item.builder()
                            .setPrice(request.get("priceId"))
                            .build())
                    .addExpand("latest_invoice.payment_intent")
                    .build();

            Subscription subscription = Subscription.create(subParams);

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

    public boolean ValidateUserAccess(String email) {
        Optional<UserSubscription> userSubscriptionOpt = userSubscriptionRepository.findByUserEmail(email);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        if ("ROLE_ADMIN".equals(user.getRole())) {
            return true;
        }

        if (userSubscriptionOpt.isPresent()) {
            UserSubscription subscription = userSubscriptionOpt.get();
            return checkStripeSubscription(subscription);
        }

        return handleFreeUserAccess(user);
    }

    private boolean checkStripeSubscription(UserSubscription subscription) {
        try {
            Subscription stripeSubscription = Subscription.retrieve(subscription.getSubscriptionId());

            if (stripeSubscription.getStatus().equals("active")) {
                return true;
            }

            if (stripeSubscription.getCancelAtPeriodEnd()) {
                return LocalDateTime.now().isBefore(LocalDateTime.ofEpochSecond(stripeSubscription.getCurrentPeriodEnd(), 0, java.time.ZoneOffset.UTC));
            }

        } catch (StripeException e) {
            return false;
        }

        return false;
    }

    private boolean handleFreeUserAccess(User user) {
        LocalDateTime now = LocalDateTime.now();

        if (user.getRequestLimitResetTime() == null || now.isAfter(user.getRequestLimitResetTime())) {
            user.setRequestCount(0);
            user.setRequestLimitResetTime(now.plusHours(RESET_INTERVAL_HOURS));
        }

        if (user.getRequestCount() < MAX_FREE_REQUESTS) {
            user.setRequestCount(user.getRequestCount() + 1);
            userRepository.save(user);
            return true;
        }

        return false;
    }
}
