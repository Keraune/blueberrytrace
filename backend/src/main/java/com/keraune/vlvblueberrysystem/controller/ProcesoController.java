package com.keraune.vlvblueberrysystem.controller;

import com.keraune.vlvblueberrysystem.dto.FormalizacionForm;
import com.keraune.vlvblueberrysystem.dto.UniformizacionForm;
import com.keraune.vlvblueberrysystem.service.CamaService;
import com.keraune.vlvblueberrysystem.service.LoteService;
import com.keraune.vlvblueberrysystem.service.ProcesoOperativoService;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/procesos")
public class ProcesoController {

    private static final String VIEW = "procesos/index";
    private static final String FRAGMENT = "procesos/index :: moduleContent";

    private final ProcesoOperativoService procesoOperativoService;
    private final LoteService loteService;
    private final CamaService camaService;

    public ProcesoController(ProcesoOperativoService procesoOperativoService, LoteService loteService, CamaService camaService) {
        this.procesoOperativoService = procesoOperativoService;
        this.loteService = loteService;
        this.camaService = camaService;
    }

    @GetMapping
    public String vistaProcesos(
            Model model,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        cargarModeloBase(model);
        return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
    }

    @PostMapping("/uniformizacion")
    public String guardarUniformizacion(
            @Valid @ModelAttribute("uniformizacionForm") UniformizacionForm form,
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
            procesoOperativoService.crearUniformizacion(form, principal.getName());
            String message = "Uniformización registrada correctamente.";
            if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
                model.addAttribute("successMessage", message);
                model.addAttribute("uniformizacionForm", procesoOperativoService.crearFormularioUniformizacionInicial());
                cargarModeloBase(model);
                return FRAGMENT;
            }
            redirectAttributes.addFlashAttribute("successMessage", message);
            return "redirect:/procesos";
        } catch (IllegalArgumentException ex) {
            bindingResult.reject("uniformizacion.error", ex.getMessage());
            cargarModeloBase(model);
            return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
        }
    }

    @PostMapping("/formalizacion")
    public String guardarFormalizacion(
            @Valid @ModelAttribute("formalizacionForm") FormalizacionForm form,
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
            procesoOperativoService.crearFormalizacion(form, principal.getName());
            String message = "Formalización registrada correctamente.";
            if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
                model.addAttribute("successMessage", message);
                model.addAttribute("formalizacionForm", procesoOperativoService.crearFormularioFormalizacionInicial());
                cargarModeloBase(model);
                return FRAGMENT;
            }
            redirectAttributes.addFlashAttribute("successMessage", message);
            return "redirect:/procesos";
        } catch (IllegalArgumentException ex) {
            bindingResult.reject("formalizacion.error", ex.getMessage());
            cargarModeloBase(model);
            return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
        }
    }

    @PostMapping("/uniformizacion/{id}/estado")
    public String cambiarEstadoUniformizacion(
            @PathVariable Long id,
            Model model,
            RedirectAttributes redirectAttributes,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        String message = "Estado de uniformización actualizado.";
        procesoOperativoService.cambiarEstadoUniformizacion(id);

        if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
            model.addAttribute("successMessage", message);
            cargarModeloBase(model);
            return FRAGMENT;
        }

        redirectAttributes.addFlashAttribute("successMessage", message);
        return "redirect:/procesos";
    }

    @PostMapping("/formalizacion/{id}/estado")
    public String cambiarEstadoFormalizacion(
            @PathVariable Long id,
            Model model,
            RedirectAttributes redirectAttributes,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        String message = "Estado de formalización actualizado.";
        procesoOperativoService.cambiarEstadoFormalizacion(id);

        if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
            model.addAttribute("successMessage", message);
            cargarModeloBase(model);
            return FRAGMENT;
        }

        redirectAttributes.addFlashAttribute("successMessage", message);
        return "redirect:/procesos";
    }

    private void cargarModeloBase(Model model) {
        if (!model.containsAttribute("uniformizacionForm")) {
            model.addAttribute("uniformizacionForm", procesoOperativoService.crearFormularioUniformizacionInicial());
        }
        if (!model.containsAttribute("formalizacionForm")) {
            model.addAttribute("formalizacionForm", procesoOperativoService.crearFormularioFormalizacionInicial());
        }
        model.addAttribute("lotes", loteService.listarTodos());
        model.addAttribute("camas", camaService.listarTodas());
        model.addAttribute("uniformizaciones", procesoOperativoService.listarUniformizaciones());
        model.addAttribute("formalizaciones", procesoOperativoService.listarFormalizaciones());
        model.addAttribute("estadosDisponibles", List.of("REGISTRADA", "ANULADA"));
    }
}
