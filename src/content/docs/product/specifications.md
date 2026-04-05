---
title: Technical Specifications
description: Complete technical specifications for HeyZack's 128-product ecosystem, including connectivity protocols, power options, compatibility, and detailed product category breakdown.
summary: Technical reference for HeyZack connectivity, compatibility, product categories, and deployment specifications.
category: product
docId: product-specifications
docType: spec
audience:
  - all
status: active
canonicalPath: /docs/product/specifications/
related:
  - product/overview
  - product/features
  - heyzackv2/product
ingestPriority: 5
chunkStrategy: heading
tags:
  - specifications
  - technical
  - connectivity
  - compatibility
  - protocols
  - hardware
sources:
  - heyzackv2/product.md
  - heyzackv2/messaging/mds_master.md
lastUpdated: 2025-01-25
---

# Technical Specifications

HeyZack offers a comprehensive ecosystem of 128 smart products across 15 categories, designed for both residential and commercial environments. This document details the technical specifications, connectivity options, and product portfolio.

## Quick Reference

| Specification | Value |
|---------------|-------|
| **Total Products** | 128 |
| **Categories** | 15 |
| **Connectivity Protocols** | WiFi, Zigbee 3.0, Bluetooth, Matter, IR |
| **Power Options** | Battery, Solar, Hardwired, USB-C |
| **Weather Ratings** | IP20 (indoor) to IP65 (outdoor) |
| **Operating Temperature** | -20°C to 60°C |
| **Languages Supported** | 16 |

---

## Connectivity Protocols

### WiFi
| Spec | Details |
|------|---------|
| **Frequency** | 2.4GHz (some devices dual-band 2.4G & 5GHz) |
| **Standard** | 802.11 b/g/n |
| **Use Case** | Primary connectivity for most devices |

### Zigbee
| Spec | Details |
|------|---------|
| **Version** | Zigbee 3.0 |
| **Topology** | Mesh networking |
| **Range** | 10-30m (extended via mesh) |
| **Use Case** | Sensors, switches, low-power devices |

### Bluetooth
| Spec | Details |
|------|---------|
| **Types** | BLE and BLE Mesh |
| **Range** | Up to 10m |
| **Use Case** | Pairing, proximity features, mesh lighting |

### Matter
| Spec | Details |
|------|---------|
| **Support** | Gateway-enabled |
| **Benefit** | Cross-platform interoperability |
| **Use Case** | Apple HomeKit integration, future-proofing |

### IR (Infrared)
| Spec | Details |
|------|---------|
| **Frequency** | 38KHz |
| **Type** | Universal remote control |
| **Use Case** | Legacy device integration (AC, TV, AV) |

---

## Power Options

| Power Type | Specifications | Typical Use |
|------------|----------------|-------------|
| **Battery (Disposable)** | AAA, AA, CR2032 | Sensors, remotes |
| **Battery (Rechargeable)** | Lithium, USB-C charging | Cameras, locks |
| **Solar** | 6W panels | Outdoor cameras |
| **Hardwired** | AC 100-240V, 50/60Hz | Switches, panels, climate |
| **USB-C** | 5V DC | Indoor cameras, accessories |

---

## Environmental Specifications

### Weather Resistance

| Rating | Protection Level | Product Types |
|--------|------------------|---------------|
| **IP65** | Dust-tight, water jets protected | Outdoor cameras, doorbells |
| **IP20** | Touch protection only | Indoor devices |

### Operating Conditions

| Parameter | Range |
|-----------|-------|
| **Temperature** | -20°C to 60°C (-4°F to 140°F) |
| **Humidity** | 0-95% RH (non-condensing) |

---

## Platform Compatibility

### Native App Support
- **Tuya Smart / Smart Life app** (primary)
- iOS 12.0+ / Android 6.0+

### Voice Assistants
| Platform | Integration Level |
|----------|-------------------|
| **Amazon Alexa** | Full native support |
| **Google Assistant** | Full native support |
| **Apple Siri** | Via Matter gateway |

### Smart Home Ecosystems
| Platform | Compatibility |
|----------|---------------|
| **Amazon Alexa** | Native |
| **Google Home** | Native |
| **Apple HomeKit** | Via Matter |
| **SmartThings** | Via Zigbee/WiFi |
| **Home Assistant** | Via multiple protocols |

---

## Product Portfolio by Category

### Camera & Doorbell (9 Products)

| Product Type | Resolution | Key Features | Connectivity |
|--------------|------------|--------------|--------------|
| Video Doorbell | 2K / 1080p | Two-way audio, motion detection | WiFi |
| Indoor Camera | 1080p / 2K | Night vision, pan/tilt, SD storage | WiFi |
| Outdoor Camera | 2K | IP65, night vision, solar option | WiFi |
| Battery Doorbell | 1080p | Wire-free, rechargeable | WiFi |
| Solar Doorbell | 2K | 6W panel, perpetual power | WiFi |

**Price Range**: $35 - $120

---

### Smart Sensors (13 Products)

| Sensor Type | Detection | Power | Connectivity |
|-------------|-----------|-------|--------------|
| Motion Sensor | PIR, 8m range | Battery (CR2032/AAA) | Zigbee |
| Door/Window Sensor | Magnetic reed | Battery (CR2032) | Zigbee |
| Temperature & Humidity | ±0.5°C accuracy | Battery (AAA) | Zigbee/WiFi |
| Water Leak Sensor | Conductive detection | Battery (AAA) | Zigbee/WiFi |
| Gas Detector | Natural gas, LPG | Hardwired | WiFi |
| Smoke Detector | Photoelectric | Battery (10-year) | Zigbee/WiFi |
| IR Remote Controller | 38KHz, 360° | USB-C powered | WiFi |

**Price Range**: $12 - $45

---

### Smart Control Panel (6 Products)

| Display Size | Features | Gateway | Connectivity |
|--------------|----------|---------|--------------|
| 3.5" Touch | Basic control | Zigbee only | WiFi + Zigbee |
| 4.3" Touch | Voice control, intercom | Zigbee | WiFi + Zigbee |
| 6" Touch | Built-in Alexa | Zigbee + BT | WiFi + Zigbee + BT |
| 7" Touch | Full automation hub | Multi-protocol | WiFi + Zigbee + BT |
| 10.1" Touch | Commercial grade | Multi-protocol | WiFi + Zigbee + BT + Matter |

**Price Range**: $85 - $280

---

### Smart Switch (5 Products)

| Configuration | Display | Load Capacity | Connectivity |
|---------------|---------|---------------|--------------|
| 1-Gang | LCD | Up to 600W | WiFi/Zigbee |
| 2-Gang | LCD | Up to 600W per gang | WiFi/Zigbee |
| 3-Gang | LCD | Up to 600W per gang | WiFi/Zigbee |
| 4-Gang | LCD | Up to 600W per gang | WiFi/Zigbee |
| Scene Switch | Touch | N/A (trigger only) | Zigbee |

**Price Range**: $28 - $55

---

### Smart DIY Breaker (5 Products)

| Type | Capacity | Features | Connectivity |
|------|----------|----------|--------------|
| Dry Contact 1CH | 16A | Power monitoring | WiFi |
| Dry Contact 2CH | 16A per channel | Power monitoring | WiFi |
| Dry Contact 4CH | 16A per channel | Power monitoring | WiFi |
| DIN Rail | 16A | Circuit protection | WiFi |
| Mini Breaker | 10A | Compact form | WiFi/Zigbee |

**Price Range**: $22 - $48

---

### Smart Door Lock (10 Products)

| Lock Type | Authentication Methods | Power | Connectivity |
|-----------|------------------------|-------|--------------|
| Fingerprint Lock | Fingerprint, PIN, key | 4× AA | WiFi/Zigbee |
| Face Recognition Lock | Face, fingerprint, PIN | 8× AA | WiFi |
| Video Lock | Camera + fingerprint + PIN | Rechargeable | WiFi |
| Keypad Lock | PIN, key, app | 4× AA | Zigbee |
| Smart Deadbolt | App, PIN | 4× AA | WiFi/Zigbee |

**Price Range**: $120 - $380

---

### Smart Climate (14 Products)

| Product Type | Control Range | Features | Connectivity |
|--------------|---------------|----------|--------------|
| WiFi Thermostat | 5-35°C | Touch screen, scheduling | WiFi |
| Zigbee Thermostat | 5-35°C | Battery backup | Zigbee |
| Radiator Valve (TRV) | 5-30°C | Zigbee mesh | Zigbee |
| VRF Controller | System-dependent | Commercial HVAC | WiFi |
| Floor Heating Controller | 5-45°C | Multi-zone | WiFi |
| AC Controller (IR) | Device-dependent | Universal IR | WiFi |
| Fan Coil Controller | 3-speed + temp | Hotel/commercial | WiFi |

**Price Range**: $45 - $95

---

### Smart Gateway (4 Products)

| Gateway Type | Protocols Supported | Device Capacity | Connectivity |
|--------------|---------------------|-----------------|--------------|
| Zigbee Hub | Zigbee 3.0 | 100+ devices | WiFi + Zigbee |
| Multi-Protocol Hub | Zigbee, BLE, IR | 200+ devices | WiFi + Zigbee + BT |
| Matter Bridge | Matter, Zigbee | 150+ devices | WiFi + Zigbee + Matter |
| Mini Gateway | Zigbee 3.0 | 50 devices | WiFi + Zigbee |

**Price Range**: $35 - $65

---

### Smart Lighting (18 Products)

| Product Type | Power/Dimming | Color Options | Connectivity |
|--------------|---------------|---------------|--------------|
| LED Driver | 12-48V DC | CCT/RGB/RGBW | Zigbee/WiFi |
| 0-10V Dimmer | Up to 400W | N/A | WiFi |
| DALI Controller | DALI-2 standard | Full spectrum | WiFi |
| Triac Dimmer | Up to 200W | N/A | WiFi/Zigbee |
| RGB Controller | 12-24V DC | 16M colors | Zigbee |
| Strip Driver | Up to 15m strips | RGB/RGBW | WiFi/Zigbee |
| DMX Controller | 512 channels | Full DMX | WiFi |

**Price Range**: $22 - $68

---

### Curtain Systems (29 Products)

| Product Type | Motor Power | Max Load | Connectivity |
|--------------|-------------|----------|--------------|
| Tubular Motor (25mm) | 10-20Nm | 25kg | WiFi/Zigbee |
| Tubular Motor (35mm) | 20-50Nm | 50kg | WiFi/Zigbee |
| Tubular Motor (45mm) | 50-100Nm | 100kg | WiFi/Zigbee |
| Track Motor | 30W | 50kg | WiFi/Zigbee |
| Roller Blind Motor | 15W | 20kg | WiFi/Zigbee |
| Curtain Controller | N/A | Motor control | Zigbee |
| Manual Override | N/A | Mechanical | N/A |

**Price Range**: $55 - $180

---

### Smart Music (3 Products)

| Product Type | Power | Features | Connectivity |
|--------------|-------|----------|--------------|
| Ceiling Speaker (5") | 20W | Bluetooth 5.0 | Bluetooth + WiFi |
| Ceiling Speaker (8") | 40W | Bluetooth 5.0, stereo pair | Bluetooth + WiFi |
| Multi-Room Amp | 2× 50W | Whole-home audio | WiFi |

**Price Range**: $45 - $120

---

### Pet Accessories (2 Products)

| Product Type | Capacity | Features | Connectivity |
|--------------|----------|----------|--------------|
| Smart Pet Feeder | 4L | Scheduled feeding, camera | WiFi |
| Smart Bird Feeder | 2L | Motion-triggered camera | WiFi |

**Price Range**: $65 - $95

---

### Smart Accessories (5 Products)

| Product Type | Outlets/Ports | Features | Connectivity |
|--------------|---------------|----------|--------------|
| Smart Power Strip | 4 AC + 2 USB | Individual control, surge | WiFi |
| Smart Outlet | 1 AC | Energy monitoring | WiFi/Zigbee |
| USB Smart Charger | 4 USB | Fast charging | WiFi |
| Outdoor Outlet | 2 AC (IP44) | Weather resistant | WiFi |

**Price Range**: $18 - $45

---

### Smart Circuit Breaker (2 Products)

| Configuration | Rating | Features | Connectivity |
|---------------|--------|----------|--------------|
| 2P Breaker | 63A | Power monitoring, remote trip | WiFi |
| 3P Breaker | 63A | Power monitoring, remote trip | WiFi |

**Price Range**: $85 - $145

---

### Smart Door Lock Body (3 Products)

| Type | Compatibility | Features |
|------|---------------|----------|
| Mortise Lock Body | Standard doors | Multi-point locking |
| Deadbolt Mechanism | US standard | Auto-lock |
| Euro Cylinder | European standard | Thumbturn option |

**Price Range**: $45 - $95

---

## Product Portfolio Summary

| Category | Products | Price Range (USD) |
|----------|----------|-------------------|
| Camera & Doorbell | 9 | $35 - $120 |
| Smart Sensors | 13 | $12 - $45 |
| Smart Control Panel | 6 | $85 - $280 |
| Smart Switch | 5 | $28 - $55 |
| Smart DIY Breaker | 5 | $22 - $48 |
| Smart Door Lock | 10 | $120 - $380 |
| Smart Climate | 14 | $45 - $95 |
| Smart Gateway | 4 | $35 - $65 |
| Smart Lighting | 18 | $22 - $68 |
| Curtain Systems | 29 | $55 - $180 |
| Smart Music | 3 | $45 - $120 |
| Pet Accessories | 2 | $65 - $95 |
| Smart Accessories | 5 | $18 - $45 |
| Smart Circuit Breaker | 2 | $85 - $145 |
| Smart Door Lock Body | 3 | $45 - $95 |
| **Total** | **128** | **$12 - $380** |

---

## Commercial/Bulk Pricing

| Volume | Discount |
|--------|----------|
| 50+ units | Volume discount available |
| Project pricing | Custom quotes for commercial installations |
| Partner/Reseller | Program available |

---

## Distribution Channels

### Direct-to-Consumer (DTC)
- heyzack.ai website (primary)
- Amazon marketplace
- Regional e-commerce platforms

### B2B Channels
- Authorized distributors
- System integrators
- Property technology partners
- Electrical wholesalers

### Retail (Planned)
- Home improvement stores
- Electronics retailers

---

## Related Documentation

- [Product Overview](./overview.md) — Brand positioning and value propositions
- [Features & Benefits](./features.md) — Feature breakdown with use cases
- [Installation Guide](../support/installation.md) — Setup instructions by product
- [Compatibility Matrix](../support/compatibility.md) — Device interoperability details
