# FileMaker Order Upload Fix - Documentation

**Date:** January 7-8, 2026 (Original Issue) | June 2-9, 2026 (Network Equipment Upgrade)  
**Issue:** WooCommerce checkout failure - orders not uploading to FileMaker  
**Status:** ✅ RESOLVED - Permanent SFTP fix deployed, automated uploads working

---

## Problem Summary

### Initial Symptom
- Customers unable to complete checkout on production website
- Error message: FTP connection failure
- Revenue loss - checkout completely broken

### Root Cause
- IT department switched from FTP (port 21) to SFTP (port 22) for security
- WordPress code still using old FTP connection
- Orders saved to WordPress but not transferred to FileMaker for fulfillment

---

## Solutions Implemented

### Phase 1: Emergency Fix (COMPLETED - January 7, 2026)

**Goal:** Restore checkout immediately to prevent further revenue loss

**Action Taken:**
1. Modified `.env.local` file on production server
2. Cleared all FTP credentials (set to empty values) to force graceful failure
3. This allowed checkout to complete while orders queued locally

**Result:**
- ✅ Checkout working
- ✅ Orders saved to WordPress successfully
- ✅ `.mer` files generated
- ⚠️ Orders NOT automatically uploaded to FileMaker (requires manual upload)

---

### Phase 2: Manual Upload Process (COMPLETED - January 8, 2026)

**Goal:** Establish interim process to upload orders to FileMaker daily

**Setup:**
- Installed WinSCP for SFTP file transfers
- IT configured network access and port forwarding
- Established SFTP connection to FileMaker server
- Tested end-to-end upload process

**Daily Process:**
1. Download `.mer` files from WordPress File Manager
2. Upload to FileMaker server via SFTP
3. FileMaker middleware auto-processes files

---

### Phase 3: Permanent SFTP Fix (COMPLETED - January 2026)

**Goal:** Automate order uploads from WordPress to FileMaker via SFTP

**Implementation:**
- Installed `phpseclib` library for SFTP support
- Rewrote FTP upload function to use SFTP
- Updated `.env.local` with SFTP configuration
- Deployed to production with monitoring

**Result:** ✅ Automated uploads working successfully

---

### Phase 4: Network Equipment Upgrade (June 2-9, 2026)

**Issue:** IT deployed new network equipment, changing external IP addresses

**Impact:**
- Orders from June 3-8 failed to upload to FileMaker
- Checkout continued working (orders saved to WordPress)
- Customer fulfillment delayed

**Resolution:**
1. **IP Address Update** - Updated WordPress `.env.local` configuration
2. **VPN Setup** - IT configured VPN access for manual uploads
3. **SSH Key Authentication** - Updated to require SSH key + password
4. **Firewall Whitelist** - WordPress server IP whitelisted on new equipment
5. **Backlog Resolution** - Missed orders manually provided to IT for entry

**Final Status:** ✅ Automated uploads restored June 8, 2026

---

## Technical Architecture

### Order Upload Flow

```
Customer Checkout (WooCommerce)
    ↓
WordPress Order Processing
    ↓
Generate .mer file (CSV format)
    ↓
Save to: /wp-content/uploads/order_csv/
    ↓
SFTP Upload to FileMaker Server
    ↓
FileMaker Middleware detects file
    ↓
Import to FileMaker database
    ↓
Order fulfillment process begins
```

### File Format: .mer Files

- Custom CSV file format with `.mer` extension
- One file per order
- Filename pattern: `order__YYYYMMDD_ORDERID.mer`

**Key Fields:**
- Order ID and date
- Customer information (billing/shipping)
- Line items (product SKU, quantity, price)
- Totals and shipping method

### WordPress Code Structure

**Theme Location:** `/wp-content/themes/bapi-v4/`

**Key Files:**
1. `functions.php` - Contains SFTP upload function using phpseclib
2. `src/Vendi/BAPI/Theme/Utility/FtpCredentialUtility.php` - Retrieves credentials from environment
3. `.config/.env.local` - Stores SFTP connection details

**Environment Variables:**
- `BAPI_FTP_HOST_ORDERS` - FileMaker server hostname/IP
- `BAPI_FTP_USER_ORDERS` - SFTP username
- `BAPI_FTP_PASS_ORDERS` - SFTP password (stored securely)
- `BAPI_FTP_PORT_ORDERS` - SFTP port number

---

## Server Configuration

### Production WordPress Server
- **Site:** www.bapihvac.com
- **Server:** prod-2025.bapihvac.com
- **Provider:** DigitalOcean (NYC3)
- **Management:** SpinupWP
- **OS:** Ubuntu 24.04 LTS
- **PHP:** 8.2
- **MySQL:** 8.4

### FileMaker Server
- **Access Methods:**
  - Internal (via VPN): Standard SFTP port
  - External (automated): Custom port forwarding
- **Protocol:** SFTP (SSH File Transfer Protocol)
- **Authentication:** SSH key + password (two-factor)
- **Processing:** Automated middleware monitors upload directory

---

## Troubleshooting

### Checkout Still Failing
**Symptom:** Customers see error during checkout

**Checks:**
1. Verify WordPress cache is clear
2. Check PHP error logs in WP Admin → Tools → Site Health
3. Verify WooCommerce order was created

### SFTP Connection Issues
**Symptom:** Cannot connect to FileMaker server

**Checks:**
1. Verify network connectivity
2. Check if VPN is required and connected
3. Confirm firewall rules are active
4. Verify credentials are correct

### Files Not Appearing in FileMaker
**Symptom:** Uploads complete but orders missing

**Checks:**
1. Ask IT if middleware service is running
2. Verify files uploaded to correct directory
3. Check file permissions
4. Verify `.mer` file format is correct

### Missing Orders from Past
**Symptom:** Customer Service reports orders never received

**Solution:**
1. Check WordPress `/wp-content/uploads/order_csv/` for backlog
2. Download all `.mer` files from missing date range
3. Manually upload via SFTP
4. Coordinate with IT to verify FileMaker receives files

---

## Contact Information

### IT Department
- Network/Firewall configuration
- FileMaker server status
- VPN access and credentials

### Customer Service
- Missing order identification
- FileMaker status verification
- Order number tracking

### SpinupWP Support
- WordPress server access
- Backups and restore points
- Server maintenance

---

## Timeline Summary

### January 7, 2026 (Tuesday)
- 🔴 Issue discovered: Checkout broken with FTP error
- 🔍 Root cause identified: FTP→SFTP migration
- ⚡ Emergency fix deployed
- ✅ Checkout restored

### January 8, 2026 (Wednesday)
- 🔧 IT coordination for network access
- 📦 WinSCP setup and testing
- ✅ Manual upload process validated
- 📝 Documentation completed

### January 2026 (Following Weeks)
- 🚀 Permanent SFTP fix deployed
- ✅ Automated uploads working
- ✅ Production validation complete

### June 2, 2026 (Sunday)
- 🔧 IT infrastructure change: New network equipment
- 📧 Email notification of IP address changes

### June 3-7, 2026
- ❌ Orders failing to upload (wrong IP configuration)
- ✅ Checkout still working (orders saved locally)

### June 4, 2026 (Wednesday)
- 📝 Configuration updated with new IP addresses
- 🧪 Connectivity testing

### June 8, 2026 (Sunday)
- 🔐 VPN access configured
- 🔑 SSH key authentication set up
- 🌐 Firewall whitelist confirmed
- ✅ Automated uploads restored
- 📤 Backlog orders provided to IT

### June 9, 2026 (Monday)
- ✅ System fully operational
- ✅ Backlog processed by IT
- 📝 Documentation updated

---

## Success Criteria

### Emergency Fix ✅
- [x] Checkout functional for customers
- [x] Orders saved to WordPress database
- [x] .mer files generated correctly
- [x] No revenue loss

### Manual Process ✅
- [x] SFTP connection working
- [x] Files successfully upload to FileMaker
- [x] IT confirms middleware processing
- [x] Test orders verified end-to-end
- [x] Documentation complete

### Permanent Fix ✅ (Completed January 2026)
- [x] phpseclib library installed on production
- [x] SFTP code deployed
- [x] Automated uploads confirmed working
- [x] Manual process no longer needed for daily operations
- [x] IT sign-off received

### June 2026 Network Upgrade ✅
- [x] WordPress configuration updated
- [x] VPN access configured
- [x] SSH key authentication set up
- [x] Firewall whitelist confirmed
- [x] Automated uploads restored
- [x] Backlog orders processed
- [x] Documentation updated

---

## Security Notes

⚠️ **IMPORTANT:** This document contains process and architecture information only.

**Sensitive information is NOT stored in this repository:**
- SFTP passwords and credentials
- Internal network IP addresses and hostnames
- SSH private keys
- Firewall configuration details

**For access to sensitive configuration details:**
- Contact IT Department
- Refer to secure password management system
- Check SpinupWP dashboard for server credentials

**Never commit to version control:**
- Passwords or API keys
- Internal network topology
- SSH private keys
- Production server credentials

---

**Document maintained by:** Andrew Teece  
**Last updated:** June 9, 2026  
**Version:** Public (sanitized)  
**Private version:** FILEMAKER-ORDER-UPLOAD-FIX-PRIVATE.md (local only, not in git)

---

## Quick Reference

### Configuration Files
- WordPress: `/wp-content/themes/bapi-v4/.config/.env.local`
- Upload directory: `/wp-content/uploads/order_csv/`

### Port Reference
- Internal (VPN access): Standard SFTP port
- External (automated access): Custom forwarded port

### Authentication
- Username: Configured in `.env.local`
- Password: Stored in secure password manager
- SSH Key: Required for VPN access (contact IT)

### VPN Access
- VPN Software: FortiClient VPN
- Setup: Contact IT for credentials
- Purpose: Manual file uploads and troubleshooting
