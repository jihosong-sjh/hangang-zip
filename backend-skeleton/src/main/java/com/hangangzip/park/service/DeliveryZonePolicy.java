package com.hangangzip.park.service;

import com.hangangzip.park.domain.DeliveryZoneEntity;

public final class DeliveryZonePolicy {

    public static final String OPS_ONLY_DISPLAY_POLICY = "ops_only";
    public static final String REJECTED_VERIFICATION_STATUS = "rejected";

    private DeliveryZonePolicy() {
    }

    public static boolean isVisible(DeliveryZoneEntity deliveryZone) {
        return !OPS_ONLY_DISPLAY_POLICY.equals(deliveryZone.getDisplayPolicy())
            && !REJECTED_VERIFICATION_STATUS.equals(deliveryZone.getVerificationStatus());
    }
}
