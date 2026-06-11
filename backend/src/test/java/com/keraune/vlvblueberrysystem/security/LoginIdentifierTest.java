package com.keraune.vlvblueberrysystem.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginIdentifierTest {
    @Test
    void normalizaUsuarioOCorreoParaLogin() {
        assertEquals("admin", LoginIdentifier.normalize("  Admin "));
        assertEquals("admin@vlv.com", LoginIdentifier.normalize(" ADMIN@VLV.COM "));
    }

    @Test
    void detectaCorreoComoIdentificadorValido() {
        assertFalse(LoginIdentifier.isEmail("admin"));
        assertTrue(LoginIdentifier.isEmail("admin@vlv.com"));
    }
}
