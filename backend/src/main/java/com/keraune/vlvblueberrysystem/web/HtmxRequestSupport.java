package com.keraune.vlvblueberrysystem.web;

public final class HtmxRequestSupport {

    public static final String HX_REQUEST_HEADER = "HX-Request";

    private HtmxRequestSupport() {
    }

    public static boolean isHtmxRequest(String headerValue) {
        return "true".equalsIgnoreCase(headerValue);
    }

    public static String view(String fullView, String fragmentView, String headerValue) {
        return isHtmxRequest(headerValue) ? fragmentView : fullView;
    }
}
