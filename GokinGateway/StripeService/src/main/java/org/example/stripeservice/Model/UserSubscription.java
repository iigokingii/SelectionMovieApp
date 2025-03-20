package org.example.stripeservice.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_subscription")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_subscription_id_seq")
    @SequenceGenerator(name = "user_subscription_id_seq", sequenceName = "user_subscription_id_seq", allocationSize = 1)
    private Long Id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subscription_id", nullable = false, unique = true)
    private String subscriptionId;

    @Column(name = "cancel_at_period_end")
    private Boolean cancelAtPeriodEnd;

    @Column(name = "user_email")
    private String userEmail;
}

