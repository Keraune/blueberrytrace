package com.keraune.vlvblueberrysystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/reportes")
public class ReporteController {

    @GetMapping
    public String vistaReportes() {
        return "reportes/index";
    }
}
