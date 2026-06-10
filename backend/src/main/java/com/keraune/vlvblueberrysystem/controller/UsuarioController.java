package com.keraune.vlvblueberrysystem.controller;

import com.keraune.vlvblueberrysystem.repository.UserRepository;
import com.keraune.vlvblueberrysystem.web.HtmxRequestSupport;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

@Profile("legacy-mvc")
@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    private static final String VIEW = "usuarios/lista";
    private static final String FRAGMENT = "usuarios/lista :: moduleContent";

    private final UserRepository userRepository;

    public UsuarioController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public String listarUsuarios(
            Model model,
            @RequestHeader(value = HtmxRequestSupport.HX_REQUEST_HEADER, required = false) String hxRequest
    ) {
        model.addAttribute("usuarios", userRepository.findAllByOrderByNombreCompletoAsc());
        return HtmxRequestSupport.view(VIEW, FRAGMENT, hxRequest);
    }
}
