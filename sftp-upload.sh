#!/bin/bash

# SFTP Upload Script for 2FA Plugin
# Host: 35.224.70.159:17338
# User: bapiheadlessstaging

echo "Uploading graphql-2fa-extension.php to Kinsta staging..."

# Create SFTP batch commands
cat > /tmp/sftp-batch.txt << 'EOF'
cd public/wp-content/mu-plugins
put cms/wp-content/mu-plugins/graphql-2fa-extension.php
ls -la graphql-2fa-extension.php
bye
EOF

# Execute SFTP with batch file
sftp -P 17338 -b /tmp/sftp-batch.txt bapiheadlessstaging@35.224.70.159

# Cleanup
rm /tmp/sftp-batch.txt

echo "Upload complete!"
