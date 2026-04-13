package com.keraune.vlvblueberrysystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/procesos")
public class ProcesoController {

    @GetMapping
    public String vistaProcesos() {
        return "procesos/index";
    }
}
