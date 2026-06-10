package com.keraune.vlvblueberrysystem.controller;

import com.keraune.vlvblueberrysystem.dto.LoteForm;
import com.keraune.vlvblueberrysystem.service.LoteService;
import com.keraune.vlvblueberrysystem.web.HtmxRequestSupport;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.LocalDate;
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
@RequestMapping("/lotes")
public class LoteController {

    private static final String LIST_VIEW = "lotes/lista";
    private static final String LIST_FRAGMENT = "lotes/lista :: moduleContent";

    private final LoteService loteService;

    public LoteController(LoteService loteService) {
        this.loteService = loteService;
    }

    @GetMapping
    public String listarLotes(
            Model model,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        model.addAttribute("lotes", loteService.listarTodos());
        return HtmxRequestSupport.view(LIST_VIEW, LIST_FRAGMENT, hxRequest);
    }

    @GetMapping("/nuevo")
    public String nuevoLote(Model model) {
        if (!model.containsAttribute("loteForm")) {
            LoteForm loteForm = new LoteForm();
            loteForm.setFechaRegistro(LocalDate.now());
            model.addAttribute("loteForm", loteForm);
        }
        cargarCatalogos(model);
        model.addAttribute("modo", "crear");
        model.addAttribute("tituloFormulario", "Nuevo invernadero");
        model.addAttribute("subtituloFormulario", "Registra un invernadero con su cultivo y variedad.");
        return "lotes/form";
    }

    @PostMapping("/nuevo")
    public String guardarLote(
            @Valid @ModelAttribute("loteForm") LoteForm loteForm,
            BindingResult bindingResult,
            Principal principal,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            cargarCatalogos(model);
            model.addAttribute("modo", "crear");
            model.addAttribute("tituloFormulario", "Nuevo invernadero");
            model.addAttribute("subtituloFormulario", "Corrige los campos obligatorios.");
            return "lotes/form";
        }

        try {
            loteService.crearLote(loteForm, principal.getName());
            redirectAttributes.addFlashAttribute("successMessage", "Invernadero registrado correctamente.");
            return "redirect:/lotes";
        } catch (IllegalArgumentException ex) {
            bindingResult.rejectValue("codigo", "error.loteForm", ex.getMessage());
            cargarCatalogos(model);
            model.addAttribute("modo", "crear");
            model.addAttribute("tituloFormulario", "Nuevo invernadero");
            model.addAttribute("subtituloFormulario", "Corrige los datos y vuelve a intentar.");
            return "lotes/form";
        }
    }

    @GetMapping("/{id}/editar")
    public String editarLote(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("loteForm")) {
            model.addAttribute("loteForm", loteService.construirFormularioDesdeEntidad(id));
        }
        cargarCatalogos(model);
        model.addAttribute("loteId", id);
        model.addAttribute("modo", "editar");
        model.addAttribute("tituloFormulario", "Editar invernadero");
        model.addAttribute("subtituloFormulario", "Actualiza la información operativa del invernadero.");
        return "lotes/form";
    }

    @PostMapping("/{id}/editar")
    public String actualizarLote(
            @PathVariable Long id,
            @Valid @ModelAttribute("loteForm") LoteForm loteForm,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (bindingResult.hasErrors()) {
            cargarCatalogos(model);
            model.addAttribute("loteId", id);
            model.addAttribute("modo", "editar");
            model.addAttribute("tituloFormulario", "Editar invernadero");
            model.addAttribute("subtituloFormulario", "Corrige los campos obligatorios.");
            return "lotes/form";
        }

        try {
            loteService.actualizarLote(id, loteForm);
            redirectAttributes.addFlashAttribute("successMessage", "Invernadero actualizado correctamente.");
            return "redirect:/lotes";
        } catch (IllegalArgumentException ex) {
            bindingResult.rejectValue("codigo", "error.loteForm", ex.getMessage());
            cargarCatalogos(model);
            model.addAttribute("loteId", id);
            model.addAttribute("modo", "editar");
            model.addAttribute("tituloFormulario", "Editar invernadero");
            model.addAttribute("subtituloFormulario", "Corrige los datos y vuelve a intentar.");
            return "lotes/form";
        }
    }

    @PostMapping("/{id}/estado")
    public String cambiarEstado(
            @PathVariable Long id,
            Model model,
            RedirectAttributes redirectAttributes,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        String message = "Estado del invernadero actualizado correctamente.";
        loteService.cambiarEstado(id);

        if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
            return cargarListadoParcial(model, message);
        }

        redirectAttributes.addFlashAttribute("successMessage", message);
        return "redirect:/lotes";
    }

    @PostMapping("/{id}/eliminar")
    public String eliminarLote(
            @PathVariable Long id,
            Model model,
            RedirectAttributes redirectAttributes,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        String message = "Invernadero marcado como eliminado.";
        loteService.eliminarLogicamente(id);

        if (HtmxRequestSupport.isHtmxRequest(hxRequest)) {
            return cargarListadoParcial(model, message);
        }

        redirectAttributes.addFlashAttribute("successMessage", message);
        return "redirect:/lotes";
    }

    private String cargarListadoParcial(Model model, String successMessage) {
        model.addAttribute("successMessage", successMessage);
        model.addAttribute("lotes", loteService.listarTodos());
        return LIST_FRAGMENT;
    }

    private void cargarCatalogos(Model model) {
        model.addAttribute("estadosDisponibles", List.of("ACTIVO", "INACTIVO", "MANTENIMIENTO"));
        model.addAttribute("cultivosSugeridos", List.of("Arándano", "Vid", "Palta", "Cítricos", "Granado", "Otro"));
    }
}
