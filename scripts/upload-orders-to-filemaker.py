#!/usr/bin/env python3
"""
Upload daily WooCommerce orders (.mer files) from WordPress to FileMaker server via SFTP.

This script acts as a middleman:
1. Downloads .mer files from WordPress server (via FTP/SFTP or WordPress API)
2. Uploads them to FileMaker server via SFTP

Requirements:
    pip install paramiko requests

Usage:
    python upload-orders-to-filemaker.py [--date YYYY-MM-DD]
"""

import os
import sys
import argparse
from datetime import datetime
import paramiko
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
FILEMAKER_CONFIG = {
    'host': '207.190.107.107',
    'port': 22,
    'username': 'bapiws',
    'password': '$ub@ruLEGOsho3B0x!',
    'key_file': None,  # Path to bapiws-private.ppk converted to OpenSSH format
    'remote_path': '/FROM_WEBSITE/'
}

WORDPRESS_CONFIG = {
    # We'll use local files that you've already downloaded
    'local_mer_folder': os.path.expanduser('~/Downloads')
}


def upload_file_to_filemaker(local_file_path, remote_filename):
    """
    Upload a single .mer file to FileMaker server via SFTP.
    
    Args:
        local_file_path: Path to local .mer file
        remote_filename: Filename to use on remote server
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        logger.info(f"Connecting to FileMaker server at {FILEMAKER_CONFIG['host']}:{FILEMAKER_CONFIG['port']}")
        
        # Create SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # Connect with password (or key if provided)
        connect_kwargs = {
            'hostname': FILEMAKER_CONFIG['host'],
            'port': FILEMAKER_CONFIG['port'],
            'username': FILEMAKER_CONFIG['username'],
            'password': FILEMAKER_CONFIG['password'],
            'timeout': 30
        }
        
        if FILEMAKER_CONFIG['key_file'] and os.path.exists(FILEMAKER_CONFIG['key_file']):
            logger.info(f"Using SSH key: {FILEMAKER_CONFIG['key_file']}")
            connect_kwargs['key_filename'] = FILEMAKER_CONFIG['key_file']
        
        ssh.connect(**connect_kwargs)
        
        # Open SFTP session
        sftp = ssh.open_sftp()
        
        # Upload file
        remote_path = FILEMAKER_CONFIG['remote_path'] + remote_filename
        logger.info(f"Uploading {local_file_path} to {remote_path}")
        
        sftp.put(local_file_path, remote_path)
        
        logger.info(f"✓ Successfully uploaded {remote_filename}")
        
        # Cleanup
        sftp.close()
        ssh.close()
        
        return True
        
    except Exception as e:
        logger.error(f"✗ Failed to upload {remote_filename}: {str(e)}")
        return False


def find_mer_files(folder_path, target_date=None):
    """
    Find all .mer files in a folder, optionally filtered by date.
    
    Args:
        folder_path: Path to folder containing .mer files
        target_date: Optional date string in format YYYYMMDD
        
    Returns:
        list: List of full file paths to .mer files
    """
    if not os.path.exists(folder_path):
        logger.error(f"Folder not found: {folder_path}")
        return []
    
    mer_files = []
    
    for filename in os.listdir(folder_path):
        if not filename.endswith('.mer'):
            continue
            
        # If date filter specified, check filename contains date
        if target_date:
            if target_date not in filename:
                continue
        
        full_path = os.path.join(folder_path, filename)
        mer_files.append(full_path)
    
    return mer_files


def main():
    parser = argparse.ArgumentParser(
        description='Upload WooCommerce order .mer files to FileMaker server'
    )
    parser.add_argument(
        '--date',
        help='Date to filter files (format: YYYY-MM-DD). If not provided, uploads all .mer files in folder.',
        default=None
    )
    parser.add_argument(
        '--folder',
        help='Folder containing .mer files',
        default=WORDPRESS_CONFIG['local_mer_folder']
    )
    
    args = parser.parse_args()
    
    # Convert date format if provided (YYYY-MM-DD to YYYYMMDD for filename matching)
    target_date = None
    if args.date:
        try:
            date_obj = datetime.strptime(args.date, '%Y-%m-%d')
            target_date = date_obj.strftime('%Y%m%d')
            logger.info(f"Filtering for files from date: {target_date}")
        except ValueError:
            logger.error(f"Invalid date format: {args.date}. Use YYYY-MM-DD")
            sys.exit(1)
    else:
        # Default to today
        target_date = datetime.now().strftime('%Y%m%d')
        logger.info(f"No date specified, using today: {target_date}")
    
    # Find .mer files
    logger.info(f"Searching for .mer files in: {args.folder}")
    mer_files = find_mer_files(args.folder, target_date)
    
    if not mer_files:
        logger.warning(f"No .mer files found for date: {target_date}")
        sys.exit(0)
    
    logger.info(f"Found {len(mer_files)} file(s) to upload")
    
    # Upload each file
    success_count = 0
    fail_count = 0
    
    for file_path in mer_files:
        filename = os.path.basename(file_path)
        
        if upload_file_to_filemaker(file_path, filename):
            success_count += 1
        else:
            fail_count += 1
    
    # Summary
    logger.info(f"\n{'='*50}")
    logger.info(f"Upload Summary:")
    logger.info(f"  Successful: {success_count}")
    logger.info(f"  Failed: {fail_count}")
    logger.info(f"{'='*50}")
    
    sys.exit(0 if fail_count == 0 else 1)


if __name__ == '__main__':
    main()
