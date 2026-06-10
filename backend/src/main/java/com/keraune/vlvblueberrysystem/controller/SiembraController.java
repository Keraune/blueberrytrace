package com.keraune.vlvblueberrysystem.controller;

import com.keraune.vlvblueberrysystem.dto.SiembraForm;
import com.keraune.vlvblueberrysystem.service.CamaService;
import com.keraune.vlvblueberrysystem.service.LoteService;
import com.keraune.vlvblueberrysystem.service.SiembraService;
import com.keraune.vlvblueberrysystem.web.HtmxRequestSupport;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Profile("legacy-mvc")
@Controller
@RequestMapping("/siembra")
public class SiembraController {

    private static final String VIEW = "siembra/index";
    private static final String FRAGMENT = "siembra/index :: moduleContent";

    private final SiembraService siembraService;
    private final LoteService loteService;
    private final CamaService camaService;

    public SiembraController(SiembraService siembraService, LoteService loteService, CamaService camaService) {
        this.siembraService = siembraService;
        this.loteService = loteService;
        this.camaService = camaService;
    }

    @GetMapping
    public String vistaSiembra(
            Model model,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        cargarModeloBase(model);
        return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
    }

    @PostMapping
    public String guardarSiembra(
            @Valid @ModelAttribute("siembraForm") SiembraForm siembraForm,
            BindingResult bindingResult,
            Principal principal,
            Model model,
            RedirectAttributes redirectAttributes,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        if (bindingResult.hasErrors()) {
            cargarModeloBase(model);
            return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
        }

        try {
            siembraService.crearSiembra(siembraForm, principal.getName());
            String message = "Siembra registrada correctamente.";
            if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
                model.addAttribute("successMessage", message);
                model.addAttribute("siembraForm", siembraService.crearFormularioInicial());
                cargarModeloBase(model);
                return FRAGMENT;
            }
            redirectAttributes.addFlashAttribute("successMessage", message);
            return "redirect:/siembra";
        } catch (IllegalArgumentException ex) {
            bindingResult.reject("siembra.error", ex.getMessage());
            cargarModeloBase(model);
            return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
        }
    }

    @PostMapping("/{id}/estado")
    public String cambiarEstado(
            @PathVariable Long id,
            Model model,
            RedirectAttributes redirectAttributes,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        String message = "Estado del registro de siembra actualizado.";
        siembraService.cambiarEstado(id);

        if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
            model.addAttribute("successMessage", message);
            model.addAttribute("siembraForm", siembraService.crearFormularioInicial());
            cargarModeloBase(model);
            return FRAGMENT;
        }

        redirectAttributes.addFlashAttribute("successMessage", message);
        return "redirect:/siembra";
    }

    private void cargarModeloBase(Model model) {
        if (!model.containsAttribute("siembraForm")) {
            model.addAttribute("siembraForm", siembraService.crearFormularioInicial());
        }
        model.addAttribute("lotes", loteService.listarTodos());
        model.addAttribute("camas", camaService.listarTodas());
        model.addAttribute("siembras", siembraService.listarTodas());
        model.addAttribute("estadosDisponibles", List.of("REGISTRADA", "ANULADA"));
    }
}
