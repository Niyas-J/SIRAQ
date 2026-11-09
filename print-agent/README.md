# SIRAQ SMART PRINT — Windows 11 Local Print Agent

## Overview
The **SIRAQ Local Print Agent** is a lightweight Windows 11 background service that bridges the cloud-hosted SIRAQ Smart Print system with the shop's physical **Canon PIXMA G3010** printer.

## Architecture
```
[Customer Mobile] ---> [QR Scan / Web Upload] ---> [UPI / Razorpay Verification]
                                                               |
                                                               v
                                                      [SIRAQ Print Queue]
                                                               |
                                                               v (Authenticated Poll)
                                                [Local Python Print Agent]
                                                               |
                                                               v (Windows Spooler)
                                                [Canon PIXMA G3010 Printer]
```

## Setup Instructions

### 1. Requirements
- Windows 11 PC (Shop counter computer)
- Python 3.10 or higher
- Canon PIXMA G3010 Series printer installed and set as default (or USB/Wi-Fi connected)

### 2. Configuration (`agent_config.json`)
```json
{
  "server_url": "http://localhost:3000",
  "agent_key": "siraq-local-agent-key-2026",
  "selected_printer": "Canon G3010 series",
  "poll_interval_seconds": 5,
  "heartbeat_interval_seconds": 10,
  "auto_print_enabled": true,
  "cleanup_temp_files": true
}
```

### 3. Running the Agent
Double-click `start_agent.bat` or run in terminal:
```powershell
cd print-agent
python siraq_print_agent.py
```

### 4. Running at Windows Startup (Recommended for Shop)
To make the agent run automatically whenever the shop PC turns on:
1. Press `Win + R`, type `shell:startup`, and press Enter.
2. Create a shortcut to `start_agent.bat` in this Startup folder.
3. Done! The Print Agent will launch automatically on boot and listen for print jobs.

