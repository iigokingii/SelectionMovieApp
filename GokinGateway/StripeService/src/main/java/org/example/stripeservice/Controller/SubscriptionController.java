package org.example.stripeservice.Controller;

import org.example.stripeservice.Service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    @Autowired
    SubscriptionService subscriptionService;

    @PostMapping("/create")
    public Map<String, Object> CreateSubscription(@RequestBody Map<String, String> request) {
        return subscriptionService.CreateSubscription(request);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> CheckSubscription(@RequestParam String email) {
        return subscriptionService.CheckSubscription(email);
    }

    @PostMapping("/cancel")
    public ResponseEntity<Map<String, Object>> cancelSubscription(@RequestBody Map<String, String> request) {
        return subscriptionService.CancelSubscription(request);
    }


}
