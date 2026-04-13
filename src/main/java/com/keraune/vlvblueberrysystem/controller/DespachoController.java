package com.keraune.vlvblueberrysystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/despacho")
public class DespachoController {

    @GetMapping
    public String vistaDespacho() {
        return "despacho/index";
    }
}
