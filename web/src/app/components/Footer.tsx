import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-white border-t mt-12">
    <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col md:flex-row items-center justify-between">
      <div className="flex space-x-8 text-center md:text-left mb-4 md:mb-0">
        <div>
          <div className="font-semibold text-gray-800 mb-1">Professional Grade</div>
          <div className="text-xs text-gray-500">Industry-leading sensors and control modules</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-1">Easy Integration</div>
          <div className="text-xs text-gray-500">BACnet, Modbus, and wireless connectivity</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-1">Reliable Support</div>
          <div className="text-xs text-gray-500">Expert technical assistance when you need it</div>
        </div>
      </div>
      <div className="text-xs text-gray-400">© 2025 BAPI. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer;
