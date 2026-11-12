idf_component_register(SRCS "ota_service.cpp"
                       INCLUDE_DIRS "include"
                       REQUIRES app_update bootloader_support esp_app_format esp_http_server esp_timer json)

target_compile_features(${COMPONENT_LIB} PUBLIC cxx_std_17)
