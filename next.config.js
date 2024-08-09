module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)', // Match all routes
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'unsafe-none', // Adjust this as needed
            },
          ],
        },
      ];
    },
  };
  