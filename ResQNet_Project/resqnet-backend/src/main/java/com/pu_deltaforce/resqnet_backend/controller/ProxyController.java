package com.pu_deltaforce.resqnet_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/proxy")
@RequiredArgsConstructor
public class ProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${api.weather.key}")
    private String weatherApiKey;

    @Value("${api.tomtom.key}")
    private String tomtomApiKey;

    @GetMapping("/weather")
    public Object getProxyWeather(@RequestParam String lat, @RequestParam String lon) {
        String url = String.format("https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s&units=metric",
                lat, lon, weatherApiKey);
        return restTemplate.getForObject(url, Object.class);
    }

    @GetMapping("/tomtom-traffic")
    public Object getTomTomTraffic(@RequestParam String point) {
        String url = String.format("https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=%s&point=%s",
                tomtomApiKey, point);
        return restTemplate.getForObject(url, Object.class);
    }

    @GetMapping(value = "/tomtom-traffic/{z}/{x}/{y}.png", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getTomTomTrafficTile(@PathVariable int z, @PathVariable int x, @PathVariable int y) {
        String url = String.format("https://api.tomtom.com/traffic/map/4/tile/flow/relative/%d/%d/%d.png?key=%s",
                z, x, y, tomtomApiKey);
        return restTemplate.getForObject(url, byte[].class);
    }

    @GetMapping(value = "/tomtom-incidents/{z}/{x}/{y}.png", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getTomTomIncidentTile(@PathVariable int z, @PathVariable int x, @PathVariable int y) {
        String url = String.format("https://api.tomtom.com/traffic/map/4/tile/incidents/s3/%d/%d/%d.png?key=%s",
                z, x, y, tomtomApiKey);
        return restTemplate.getForObject(url, byte[].class);
    }
}