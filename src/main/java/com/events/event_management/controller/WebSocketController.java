package com.events.event_management.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/event.join")
    @SendTo("/topic/events")
    public String joinEvent(String message) {
        return "New participant joined: " + message;
    }
}