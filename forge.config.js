const path = require('path');

module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033,
        manufacturer: 'Matheus Diniz',
        description: 'Gestão de Restaurante',
        upgradeCode: 'PUT-GUID-HERE',
      },
    },
  ],
};
