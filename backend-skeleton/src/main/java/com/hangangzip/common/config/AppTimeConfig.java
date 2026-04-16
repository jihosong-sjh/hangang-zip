package com.hangangzip.common.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppTimeConfig {

    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
