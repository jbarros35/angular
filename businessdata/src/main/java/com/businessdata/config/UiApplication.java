package com.businessdata.config;

import java.security.Principal;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class UiApplication {
  
  @RequestMapping("/user")
  public Principal user(Principal user) {
    return user;
  }
}