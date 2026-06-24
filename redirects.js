/**
 * Central configuration for site redirects
 * 
 * Each redirect should have:
 * - fromPath: The old/source URL path
 * - toPath: The new/destination URL path
 * - isPermanent: true for 301 (permanent), false for 302 (temporary)
 * 
 * Add new redirects to the array below.
 */

module.exports = [
  // Example redirect - demonstrates the redirect system
  {
    fromPath: '/home',
    toPath: '/',
    isPermanent: true,
  },
  // Add more redirects below:
  // {
  //   fromPath: '/old-page',
  //   toPath: '/new-page',
  //   isPermanent: true,
  // },
]
