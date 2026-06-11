package com.keraune.vlvblueberrysystem.api.controller;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ApiResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.FrontendBootstrapResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/frontend")
public class ApiFrontendController {

    @GetMapping("/bootstrap")
    public ApiResponse<FrontendBootstrapResponse> bootstrap() {
        FrontendBootstrapResponse response = new FrontendBootstrapResponse(
                "BlueberryTrace",
                "v1",
                "Interfaz operativa principal para el control de trazabilidad",
                List.of("React", "Vue"),
                ApiModuleMetadata.endpoints(),
                ApiModuleMetadata.modules(),
                ApiModuleMetadata.palette()
        );
        return ApiResponse.ok("Configuración frontend cargada correctamente.", response);
    }
}
