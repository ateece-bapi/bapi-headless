#!/bin/bash
# Update bluTestLandingPage in all non-English language files

for lang in es de fr ar hi ja pl th vi zh; do
  echo "Updating messages/${lang}.json..."
  
  # Use Node.js to update the JSON file
  node << 'EOFNODE'
const fs = require('fs');
const lang = process.argv[1];
const file = `messages/${lang}.json`;

// Read the file
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Update bluTestLandingPage with new structure (keeping English for now)
data.bluTestLandingPage = {
  "metadata": {
    "title": "Blu-Test™ Precision HVAC Test & Measurement",
    "description": "Professional-grade test and measurement probes for HVAC testing. Precision measurement with the Blu-View App for iOS and Android.",
    "keywords": "HVAC test probes, temperature measurement, Blu-View app, precision probes, test equipment, HVAC testing, building automation testing"
  },
  "breadcrumb": {
    "home": "Home",
    "products": "Products",
    "bluTest": "Blu-Test™"
  },
  "hero": {
    "title": "Precision HVAC Probes You Can Trust.",
    "description": "A suite of test probes for demanding accuracy requirements across HVAC and refrigeration systems. Seamlessly integrate with the Blu-View App for precise measurement and easy data logging.",
    "cta": "Browse Probes",
    "secondaryCta": "Request Quote"
  },
  "keyFeatures": {
    "precision": {
      "title": "Precision Measurement",
      "description": "Laboratory-grade accuracy for demanding HVAC applications. High accuracy sensors comparable to leading brands."
    },
    "dataLogging": {
      "title": "Optional Data Logging",
      "description": "Record and export measurement data with timestamps. Generate professional reports for documentation."
    },
    "integration": {
      "title": "Report Closing Integration",
      "description": "Seamlessly integrate measurements into your workflow. Export to Excel, PDF, or cloud storage."
    }
  },
  "accuracy": {
    "title": "Why Accurate Reference Devices Matter",
    "subtitle": "Precision test equipment ensures proper system operation, reduces callbacks, and builds customer confidence in your work.",
    "commissioning": {
      "title": "System Commissioning",
      "description": "Verify installed sensors meet specifications during initial startup and handoff."
    },
    "troubleshooting": {
      "title": "Troubleshooting",
      "description": "Quickly identify sensor drift or failure when diagnosing HVAC problems."
    },
    "verification": {
      "title": "Sensor Verification",
      "description": "Confirm existing sensors are reading accurately without replacing them."
    },
    "calibration": {
      "title": "Field Calibration",
      "description": "Adjust sensor offsets in the field to maintain system accuracy over time."
    },
    "costSavings": {
      "title": "Reduce Callbacks",
      "description": "Accurate measurements the first time prevent costly return visits."
    },
    "reputation": {
      "title": "Professional Credibility",
      "description": "Build trust with customers by using calibrated reference equipment."
    }
  },
  "bluetooth": {
    "title": "The Bluetooth of Truth",
    "description": "Wireless connectivity means no more writing down readings. The Blu-View app automatically logs measurements with timestamps, eliminates transcription errors, and generates professional reports.",
    "feature1": "Real-time wireless data transmission to your smartphone or tablet",
    "feature2": "Automatic timestamp and location logging for complete documentation",
    "feature3": "Export to PDF, Excel, or cloud storage for easy sharing and archiving"
  },
  "bluView": {
    "badge": "Blu-View App",
    "title": "Blü-View App",
    "subtitle": "Professional test and measurement made simple. Download the free Blu-View app to unlock the full potential of your test probes with precision measurement, data logging, and cloud sync.",
    "feature1": {
      "title": "Networked Logs",
      "description": "Save measurement logs to the cloud. Access from any device, anywhere."
    },
    "feature2": {
      "title": "Integrated with Your Workflow",
      "description": "Export to Excel, PDF, or share directly from the app."
    },
    "feature3": {
      "title": "Offset Calibration",
      "description": "Field-adjustable offsets to maintain accuracy. Set custom calibration points."
    },
    "feature4": {
      "title": "Easy Pairing",
      "description": "Bluetooth pairing in seconds. No complex setup or configuration required."
    },
    "downloadIOS": "Download on App Store",
    "downloadAndroid": "Get it on Google Play"
  },
  "testProbes": {
    "title": "The Blü-Test Suite",
    "subtitle": "A comprehensive portfolio of probe styles and HVAC measurements. Each probe features wireless Bluetooth connectivity and works seamlessly with the Blu-View mobile app.",
    "tempProbe95": {
      "name": "9.5\" Temperature Probe",
      "feature1": "Extended length for deep measurements",
      "feature2": "10K Type II thermistor",
      "feature3": "Rugged stainless steel construction"
    },
    "tempProbe6": {
      "name": "6\" Temperature Probe",
      "feature1": "Compact design for general use",
      "feature2": "Fast response time",
      "feature3": "10K Type II thermistor"
    },
    "piercingProbe": {
      "name": "4\" Piercing Probe",
      "feature1": "Penetrates insulation and ductwork",
      "feature2": "Sharp tip for easy insertion",
      "feature3": "Ideal for hard-to-reach locations"
    },
    "remoteTemp": {
      "name": "Remote Temperature Probe",
      "feature1": "Separable probe on cable",
      "feature2": "Flexible positioning",
      "feature3": "Extended reach capability"
    },
    "tempHumid": {
      "name": "8\" Temperature & Humidity Probe",
      "feature1": "Dual measurement capability",
      "feature2": "Accurate RH sensing",
      "feature3": "Combined temp/humidity readings"
    },
    "standardPress": {
      "name": "Standard Range Pressure Probe",
      "feature1": "Measures duct and room pressure",
      "feature2": "±1\" WC to ±10\" WC ranges",
      "feature3": "High accuracy differential pressure"
    },
    "lowPress": {
      "name": "Low Range Pressure Probe",
      "feature1": "Ultra-sensitive pressure measurement",
      "feature2": "±0.1\" WC to ±0.5\" WC ranges",
      "feature3": "Perfect for clean room and lab applications"
    }
  },
  "specifications": {
    "title": "Technical Specifications",
    "table": {
      "header1": "Specification",
      "header2": "Value",
      "general": "General",
      "measurement": "Measurement Range",
      "environmental": "Environmental & Certifications"
    },
    "general": {
      "range": {
        "label": "Temperature Range",
        "value": "-40°F to 185°F (-40°C to 85°C)"
      },
      "accuracy": {
        "label": "Accuracy",
        "value": "±0.2°F (±0.1°C) at 77°F (25°C)"
      },
      "resolution": {
        "label": "Resolution",
        "value": "0.1°F (0.1°C)"
      }
    },
    "measurement": {
      "range": {
        "label": "Operating Range",
        "value": "-40°F to 185°F standard, extended range available"
      },
      "accuracy": {
        "label": "Measurement Accuracy",
        "value": "±0.2°F across full range with calibration"
      },
      "response": {
        "label": "Response Time",
        "value": "Less than 5 seconds in air, 1 second in liquid"
      }
    },
    "environmental": {
      "certifications": {
        "label": "Certifications",
        "value": "ISO 17025 calibrated, NIST traceable"
      },
      "warranty": {
        "label": "Warranty",
        "value": "Limited lifetime warranty"
      }
    }
  },
  "cta": {
    "title": "Ready to Upgrade Your HVAC Testing?",
    "subtitle": "Our test and measurement specialists are ready to help you choose the right probes for your applications. Get expert advice and competitive pricing.",
    "contactSales": "Contact Sales",
    "viewProducts": "View All Probes"
  }
};

// Write back
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log(`Updated ${file}`);
EOFNODE
  ${lang}
done

echo "All language files updated!"
