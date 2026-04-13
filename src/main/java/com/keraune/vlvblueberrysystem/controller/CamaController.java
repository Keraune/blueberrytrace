package com.keraune.vlvblueberrysystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/camas")
public class CamaController {

    @GetMapping
    public String listarCamas() {
        return "camas/lista";
    }
}
