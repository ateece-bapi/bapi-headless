#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read current English translations
const enPath = path.join(__dirname, '../web/messages/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

// Update to match ORIGINAL staging page content
enData.wirelessLandingPage = {
  ...enData.wirelessLandingPage,
  metadata: {
    title: "Wireless HVAC Sensors | BAPI",
    description: "Cost-effective, reliable wireless temperature and humidity monitoring for commercial buildings. Seamlessly integrate with your existing BMS without running new wires.",
    keywords: "wireless sensors, HVAC sensors, building automation, temperature monitoring, humidity sensors"
  },
  breadcrumb: {
    home: "Home",
    products: "Products",
    wireless: "Wireless Solutions"
  },
  hero: {
    badge: "",
    title: "Wireless HVAC Sensors",
    subtitle: "",
    description: "Cost-effective, reliable wireless temperature and humidity monitoring for commercial buildings. Seamlessly integrate with your existing BMS without running new wires.",
    cta: "Get Started",
    secondaryCta: ""
  },
  features: {
    title: "Why Choose Wireless?",
    subtitle: "Reduce installation costs, increase flexibility, and simplify retrofits with our proven wireless technology.",
    noWiring: {
      title: "No Wiring Required",
      description: "Eliminate expensive wire runs and reduce installation time by up to 70%."
    },
    longRange: {
      title: "Long Range Signal",
      description: "Up to 400ft range through walls and floors in typical commercial buildings."
    },
    reliable: {
      title: "10-Year Battery Life",
      description: "User-replaceable batteries last up to 10 years with optimized transmit intervals."
    },
    scalable: {
      title: "Easy Scalability",
      description: "Add up to 127 sensors per receiver. Expand your system as your needs grow."
    },
    cloudConnected: enData.wirelessLandingPage.features.cloudConnected,
    easyIntegration: enData.wirelessLandingPage.features.easyIntegration
  },
  categories: {
    title: "Wireless Sensors",
    subtitle: "The same high-quality, 100% tested sensors BAPI has made for 30 years, now with wireless integration. Choose the perfect sensor for your application.",
    roomSensors: enData.wirelessLandingPage.categories.roomSensors,
    nonRoomSensors: enData.wirelessLandingPage.categories.nonRoomSensors,
    receiversModules: enData.wirelessLandingPage.categories.receiversModules,
    accessories: enData.wirelessLandingPage.categories.accessories
  },
  specifications: {
    title: "How It Works",
    subtitle: "Our wireless system provides complete flexibility with multiple integration options to match your building automation setup.",
    wireless: {
      title: "Wireless Sensors",
      description: "Choose from temperature, humidity, or combination sensors for any application from outside air to duct to room monitoring.",
      protocol: enData.wirelessLandingPage.specifications.wireless.protocol,
      frequency: enData.wirelessLandingPage.specifications.wireless.frequency,
      range: enData.wirelessLandingPage.specifications.wireless.range,
      battery: enData.wirelessLandingPage.specifications.wireless.battery
    },
    outputs: {
      title: "Output Modules",
      description: "Convert sensor data to analog signals (0-10V, resistance) or digital protocols (BACnet IP, BACnet MS/TP, Modbus RTU).",
      bacnet: enData.wirelessLandingPage.specifications.outputs.bacnet,
      modbus: enData.wirelessLandingPage.specifications.outputs.modbus,
      analog: enData.wirelessLandingPage.specifications.outputs.analog,
      digital: enData.wirelessLandingPage.specifications.outputs.digital
    },
    environmental: enData.wirelessLandingPage.specifications.environmental
  },
  wam: enData.wirelessLandingPage.wam,
  applications: enData.wirelessLandingPage.applications,
  benefits: enData.wirelessLandingPage.benefits,
  comparison: enData.wirelessLandingPage.comparison,
  products: enData.wirelessLandingPage.products,
  cta: {
    title: "Contact Us",
    description: "Have questions about our wireless solutions? Our team is here to help you find the perfect monitoring system for your application.",
    primaryButton: "Contact Us",
    secondaryButton: "",
    phoneLabel: "",
    phone: ""
  },
  support: {
    title: "Worried about signal strength?",
    description: "Get peace of mind before you place an order. BAPI's easy-to-use app lets you verify sensor distances in your application using just your smart device and our Wireless BAPI-Stat Quantum Slim Sensor.",
    siteVerification: {
      title: "Learn More",
      description: "Get peace of mind before you place an order. BAPI's easy-to-use app lets you verify sensor distances in your application using just your smart device and our Wireless BAPI-Stat Quantum Slim Sensor.",
      cta: "Learn More"
    },
    installationGuide: enData.wirelessLandingPage.support.installationGuide,
    technicalSupport: enData.wirelessLandingPage.support.technicalSupport
  }
};

// Write updated file
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');

console.log('✅ Updated en.json to match original staging page');
