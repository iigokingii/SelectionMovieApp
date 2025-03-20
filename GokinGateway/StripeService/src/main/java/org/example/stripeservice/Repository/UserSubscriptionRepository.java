package org.example.stripeservice.Repository;

import org.example.stripeservice.Model.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    Optional<UserSubscription> findBySubscriptionId(String subscriptionId);
    Optional<UserSubscription> findByUserEmail(String email);
}
