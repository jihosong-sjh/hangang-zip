package com.hangangzip.common.error;

import java.time.LocalDateTime;

public record ApiErrorResponse(
    String code,
    String message,
    LocalDateTime timestamp
) {
}
