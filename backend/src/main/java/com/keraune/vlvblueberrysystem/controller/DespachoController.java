package com.keraune.vlvblueberrysystem.controller;

import com.keraune.vlvblueberrysystem.dto.DespachoForm;
import com.keraune.vlvblueberrysystem.service.DespachoService;
import com.keraune.vlvblueberrysystem.service.LoteService;
import com.keraune.vlvblueberrysystem.web.HtmxRequestSupport;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/despacho")
public class DespachoController {

    private static final String VIEW = "despacho/index";
    private static final String FRAGMENT = "despacho/index :: moduleContent";

    private final DespachoService despachoService;
    private final LoteService loteService;

    public DespachoController(DespachoService despachoService, LoteService loteService) {
        this.despachoService = despachoService;
        this.loteService = loteService;
    }

    @GetMapping
    public String vistaDespacho(
            Model model,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        cargarModeloBase(model);
        return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
    }

    @PostMapping
    public String guardarDespacho(
            @Valid @ModelAttribute("despachoForm") DespachoForm form,
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
            despachoService.crearDespacho(form, principal.getName());
            String message = "Despacho registrado correctamente.";
            if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
                model.addAttribute("successMessage", message);
                model.addAttribute("despachoForm", despachoService.crearFormularioInicial());
                cargarModeloBase(model);
                return FRAGMENT;
            }
            redirectAttributes.addFlashAttribute("successMessage", message);
            return "redirect:/despacho";
        } catch (IllegalArgumentException ex) {
            bindingResult.reject("despacho.error", ex.getMessage());
            cargarModeloBase(model);
            return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
        }
    }

    @PostMapping("/{id}/estado")
    public String cambiarEstado(
            @PathVariable Long id,
            @RequestParam(defaultValue = "CERRADO") String estado,
            Model model,
            RedirectAttributes redirectAttributes,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        String message = "Estado de despacho actualizado.";
        despachoService.cambiarEstado(id, estado);

        if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
            model.addAttribute("successMessage", message);
            model.addAttribute("despachoForm", despachoService.crearFormularioInicial());
            cargarModeloBase(model);
            return FRAGMENT;
        }

        redirectAttributes.addFlashAttribute("successMessage", message);
        return "redirect:/despacho";
    }

    private void cargarModeloBase(Model model) {
        if (!model.containsAttribute("despachoForm")) {
            model.addAttribute("despachoForm", despachoService.crearFormularioInicial());
        }
        model.addAttribute("lotes", loteService.listarTodos());
        model.addAttribute("despachos", despachoService.listarTodos());
        model.addAttribute("modalidades", List.of("JABAS", "BINS_MADERA"));
        model.addAttribute("validacionesCalidad", List.of("APROBADO", "OBSERVADO", "RECHAZADO"));
        model.addAttribute("estadosDisponibles", List.of("REGISTRADO", "CERRADO", "OBSERVADO", "ANULADO"));
    }
}
