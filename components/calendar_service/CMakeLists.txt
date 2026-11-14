idf_component_register(
    SRCS "calendar_service.cpp" "ics_calendar.cpp"
    INCLUDE_DIRS "include" "."
    REQUIRES esp_http_client esp_http_server esp-tls esp_timer json mbedtls nvs_flash task_config
)
