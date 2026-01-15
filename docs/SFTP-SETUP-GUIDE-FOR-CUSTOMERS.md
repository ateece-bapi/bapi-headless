# SFTP Order Upload Setup Guide
**For ALPS and Similar Customers**

**Date:** January 15, 2026  
**Prepared for:** ALPS noon call  
**Summary:** How BAPI converted from FTP to SFTP for WooCommerce orders to FileMaker

---

## Executive Summary

We recently completed a conversion from FTP to SFTP for uploading WooCommerce orders to our FileMaker server. This was driven by security concerns (FTP is unencrypted). The process involved network configuration, SFTP client setup, and code modifications. This guide summarizes what we learned to help ALPS replicate the setup.

---

## Why SFTP Instead of FTP?

**Security Difference:**
- **FTP (Port 21):** Sends passwords and data in plain text - vulnerable to sniffing
- **SFTP (Port 22):** SSH-encrypted - industry standard, secure, protects credentials

**Business Impact:**
- FTP was targeted by brute force attacks
- IT mandated SFTP for all file transfers
- Modern hosting providers often disable FTP entirely

---

## Our Implementation - 3 Phases

### Phase 1: Emergency Fix (Day 1)
**Problem:** Customers couldn't checkout - getting FTP connection errors

**Quick Solution:**
- Disabled FTP upload temporarily by clearing credentials
- This allowed checkout to complete successfully
- Orders saved to WordPress but not auto-uploaded to FileMaker
- Manual upload process established as interim solution

**Lesson:** It's okay to fail gracefully - saving orders locally while fixing the upload is better than blocking sales.

---

### Phase 2: Manual SFTP Setup (Day 2)

We established a working SFTP connection for manual daily uploads. Here's exactly what we did:

#### Network & Firewall Setup

**Challenge:** FileMaker server is on internal network (68.65.44.99) behind firewall

**Solution with IT:**
1. **Port Forwarding:** IT created external endpoint
   - External: `207.190.107.107:22` (public-facing)
   - Internal: `68.65.44.99:22222` (actual server)
   
2. **IP Whitelisting:** IT whitelisted our public IP address
   - Found our IP: https://whatismyipaddress.com
   - Gave to IT to whitelist in firewall rules
   - This prevents unauthorized access

**Key Insight:** You need BOTH port forwarding AND IP whitelisting for secure external SFTP access to internal servers.

#### SFTP Account Creation

IT created a dedicated SFTP user account:

```
Username: bapiws
Password: $ub@ruLEGOsho3B0x!
Protocol: SFTP (SSH)
Port: 22
Upload Directory: / (root of SFTP user's home)
```

**Also generated SSH key pair for password-less authentication** (optional but recommended):
- Private key: `bapiws-private.ppk` (keep secure, never share)
- Public key: Added to server's `authorized_keys`

#### SFTP Client Setup (WinSCP)

We chose **WinSCP** (free, Windows-friendly):

**Download:** https://winscp.net

**Connection Settings:**
- **File Protocol:** SFTP
- **Host name:** 207.190.107.107
- **Port:** 22
- **Username:** bapiws
- **Password:** (your SFTP password)
- **SSH Private Key:** (optional - point to .ppk file)

**Test Connection:**
- Click "Login" button
- First connection shows security warning (accept and save host key)
- Should see file browser interface

**What This Proves:**
- Network path is correct (port forwarding works)
- Credentials are valid
- Firewall rules allow your IP
- Server is running and accessible

---

### Phase 3: Automated SFTP Upload (Days 3-5)

We rewrote the WordPress code to use SFTP instead of FTP.

#### Technical Changes

**1. Install PHP SFTP Library**

Standard PHP `ftp_*` functions don't work with SFTP. We used **phpseclib**:

```bash
cd /path/to/wordpress/site
composer require phpseclib/phpseclib:~3.0
```

**2. Replace FTP Code with SFTP**

**Old FTP Code:**
```php
$conn = ftp_connect($host, $port);
ftp_login($conn, $user, $pass);
ftp_pasv($conn, true);
ftp_put($conn, $remote_file, $local_file, FTP_BINARY);
ftp_close($conn);
```

**New SFTP Code:**
```php
use phpseclib3\Net\SFTP;

$sftp = new SFTP($host, $port);
if (!$sftp->login($user, $pass)) {
    throw new Exception('SFTP login failed');
}

$sftp->put($remote_file, $local_file, SFTP::SOURCE_LOCAL_FILE);
```

**3. Update Credentials in Config**

Changed environment variables from FTP to SFTP:

```env
# Old FTP config
BAPI_FTP_HOST_ORDERS=68.65.44.99
BAPI_FTP_PORT_ORDERS=21
BAPI_FTP_USER_ORDERS=oldftpuser
BAPI_FTP_PASS_ORDERS=oldpassword

# New SFTP config
BAPI_FTP_HOST_ORDERS=207.190.107.107  # External IP
BAPI_FTP_PORT_ORDERS=22                # SFTP port
BAPI_FTP_USER_ORDERS=bapiws            # SFTP user
BAPI_FTP_PASS_ORDERS=$ub@ruLEGOsho3B0x!
```

**Note:** We kept variable names with "FTP" prefix to avoid changing too much code - they now contain SFTP values.

#### Testing Strategy

**On Staging Site First:**
1. Place test order
2. Verify `.mer` file generated
3. Check SFTP upload successful
4. Confirm IT sees file in FileMaker
5. Validate order appears in FileMaker database

**Then Production:**
1. Full WordPress backup (critical!)
2. Deploy code changes
3. Update credentials
4. Monitor first real order closely
5. Verify with Customer Service

---

## Key Challenges We Encountered

### 1. Port Forwarding Confusion
**Issue:** Initially tried connecting to internal IP (68.65.44.99) - timed out

**Solution:** IT provided external-facing IP for public access

**Lesson:** Internal IPs aren't reachable from outside. Always use public/external IP or hostname.

### 2. IP Whitelisting
**Issue:** Connection refused even with correct credentials

**Solution:** Had to give IT our public IP to whitelist in firewall

**Lesson:** Corporate firewalls often block all SFTP by default. Whitelisting required.

### 3. SSH Host Key Verification
**Issue:** First SFTP connection shows scary "unknown host" warning

**Solution:** This is normal - verify fingerprint with IT, then accept and save

**Lesson:** SSH security feature - prevents man-in-the-middle attacks.

### 4. File Permissions
**Issue:** Files uploaded but FileMaker middleware couldn't read them

**Solution:** IT adjusted SFTP user's default file permissions (644 or 755)

**Lesson:** Uploaded files need to be readable by the import process.

### 5. Upload Directory Path
**Issue:** Unclear where to upload files on SFTP server

**Solution:** IT told us SFTP user's home directory `/` is monitored by middleware

**Lesson:** Clarify with receiving system where files should land.

---

## ALPS-Specific Recommendations

### Step 1: Information Gathering (Before Call)

Ask ALPS to provide:

1. **FileMaker Server Details:**
   - Is server on local network or cloud-hosted?
   - Internal IP address
   - External/public IP or hostname (if exists)
   - What port is SFTP listening on? (usually 22)

2. **Network Setup:**
   - Is there a firewall between ALPS and FileMaker server?
   - Who manages firewall (IT person, managed service)?
   - What's ALPS's public IP address? (https://whatismyipaddress.com)

3. **Current State:**
   - Do they have ANY SFTP access currently?
   - Have they tested connection with any SFTP client?
   - Do they have SFTP credentials yet?

4. **FileMaker Integration:**
   - Does FileMaker have middleware monitoring for new files?
   - What directory should files be uploaded to?
   - What file format/naming convention? (we use `.mer` files)

### Step 2: Test SFTP Connection First

**Don't code anything until SFTP connection works!**

Use WinSCP or similar to validate:
- Network path works (firewall/routing)
- Credentials are correct
- Can create/upload/delete files
- FileMaker can see uploaded files

**Test File Upload:**
```
1. Create test file: test.txt (content: "ALPS SFTP Test")
2. Upload via WinSCP to FileMaker server
3. Have FileMaker admin confirm file visible
4. Delete test file
```

If this works, the network and auth are good - coding will be straightforward.

### Step 3: Code Integration

Once SFTP connection works manually:

**Option A: Keep Manual Process (Short-term)**
- Use WinSCP to manually upload order files daily
- Simple, no code changes
- Takes 5 minutes per day
- Good for low order volume or while testing

**Option B: Automate with Script (Medium-term)**
- Use our Python script template (available on request)
- Run manually or schedule with cron/Task Scheduler
- No WordPress code changes required
- Good for bulk uploads or daily automation

**Option C: WordPress Integration (Long-term)**
- Modify WooCommerce hooks to auto-upload via SFTP
- Install phpseclib library
- Rewrite FTP functions to use SFTP
- Fully automated, no manual intervention
- Recommended for high-volume operations

**For ALPS:** Suggest starting with Option A or B, then move to C once confident.

### Step 4: Common Troubleshooting

**Connection Timeouts:**
- Check firewall rules (IP whitelisting)
- Verify correct port (22 for SFTP, not 21)
- Test from different network (some ISPs block port 22)
- Try with VPN on/off (might route through different IP)

**Authentication Failed:**
- Double-check username (case-sensitive!)
- Verify password copied correctly (no extra spaces)
- Try SSH key authentication if password doesn't work
- Confirm SFTP user account is active/not expired

**Files Not Visible in FileMaker:**
- Confirm uploading to correct directory
- Check file permissions (644 minimum)
- Verify file naming convention matches FileMaker's expectations
- Ask FileMaker admin if middleware service is running

**"Host Key Verification Failed":**
- This is normal on first connection
- Get host key fingerprint from IT
- Accept and save the key
- Should only happen once per client

---

## Security Best Practices

### 1. Strong SFTP Passwords
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't reuse passwords from other systems
- Rotate every 90 days

### 2. SSH Keys (Better Than Passwords)
- Generate 2048-bit or 4096-bit RSA key pair
- Private key stays on upload machine (encrypted)
- Public key goes on server
- Can't be brute-forced like passwords

**Generate SSH Key:**
```bash
ssh-keygen -t rsa -b 4096 -f alps_sftp_key
# Creates alps_sftp_key (private) and alps_sftp_key.pub (public)
# Give public key to IT, keep private key secure
```

### 3. IP Whitelisting
- Only allow SFTP from known IP addresses
- Update whitelist if public IP changes
- Monitor failed login attempts

### 4. Dedicated SFTP User
- Don't use admin/root accounts for automated uploads
- Create user with limited permissions (upload only)
- Restrict to specific directory
- Can't access other files or execute commands

### 5. Monitor Upload Logs
- Review SFTP logs weekly for unusual activity
- Watch for failed login attempts
- Alert on uploads from unexpected IPs

---

## Cost Estimate

**Time Investment:**
- Manual testing (WinSCP setup): 1-2 hours
- WordPress code changes: 4-8 hours
- Testing and debugging: 2-4 hours
- Production deployment: 1-2 hours
- **Total: 8-16 hours** (1-2 days)

**Software Costs:**
- WinSCP: Free (open source)
- phpseclib: Free (open source)
- SSH client: Built into Windows 10+/macOS/Linux

**Infrastructure Costs:**
- Firewall configuration: IT time (varies)
- SFTP server: Usually already included with FileMaker hosting

---

## Questions to Ask ALPS on Call

### Network & Access
1. Do you have administrative access to FileMaker server?
2. Is FileMaker hosted internally or externally (cloud)?
3. Does your organization have IT that manages firewalls?
4. What's your current public IP address?

### Current Setup
5. Are you currently using FTP or trying to set up SFTP from scratch?
6. Have you successfully connected to FileMaker via SFTP manually?
7. Do you have SFTP credentials already?
8. What SFTP port is your server listening on?

### FileMaker Integration
9. Does FileMaker have automated file monitoring/import?
10. What directory should files be uploaded to?
11. What file format does FileMaker expect?
12. How does FileMaker know when new orders arrive?

### Technical Environment
13. What platform is your e-commerce site on? (WooCommerce, Shopify, custom)
14. Do you have developer access to modify order processing code?
15. What's your daily order volume?
16. Is this urgent or can we phase in the solution?

---

## Resources & Next Steps

### For ALPS
1. **Test SFTP connection manually first** (WinSCP recommended)
2. **Document your setup** (IP, port, user, directory path)
3. **Start with manual uploads** while perfecting the process
4. **Automate gradually** (script → WordPress integration)
5. **Contact us if stuck** - we're happy to consult

### Reference Materials
- WinSCP Guide: https://winscp.net/eng/docs/guide_connect
- phpseclib Documentation: https://phpseclib.com/docs/sftp
- SSH Key Generation: https://www.ssh.com/academy/ssh/keygen

### Our Files Available
- `upload-orders-to-filemaker.py` - Python automation script
- Code snippets for WordPress SFTP integration
- WinSCP session configuration template

---

## Call Agenda (Noon Today)

**Time: 30-45 minutes**

1. **Introductions** (2 min)
   - Our experience with FTP→SFTP conversion
   - ALPS's current situation and pain points

2. **Discovery** (10 min)
   - Ask questions above
   - Understand ALPS's infrastructure
   - Identify blockers

3. **Technical Walkthrough** (15 min)
   - Show our 3-phase approach
   - Demo WinSCP connection
   - Explain network requirements
   - Review code changes (if applicable)

4. **Problem Solving** (10 min)
   - Address ALPS's specific challenges
   - Suggest action plan
   - Identify who needs to do what

5. **Next Steps** (5 min)
   - Define deliverables
   - Set timeline expectations
   - Schedule follow-up if needed

---

## Success Criteria for ALPS

### Immediate (Week 1)
- [ ] SFTP connection working manually (WinSCP)
- [ ] Can upload test file to FileMaker server
- [ ] FileMaker confirms receiving files
- [ ] Upload directory and permissions confirmed

### Short-term (Week 2-3)
- [ ] Manual order upload process documented
- [ ] File format validated with FileMaker
- [ ] Backup/recovery process established
- [ ] Team trained on manual uploads

### Long-term (Month 2-3)
- [ ] Automated upload solution designed
- [ ] Code changes implemented and tested
- [ ] Production deployment successful
- [ ] Monitoring and alerting in place

---

## Contact

**For follow-up questions:**
- Andrew Teece (BAPI Development)
- Available for technical consultation
- Can share code samples and scripts

**Good luck with the ALPS call!**

---

**Document prepared:** January 15, 2026  
**Call scheduled:** Today at Noon  
**Confidence level:** High - we just completed this exact process
