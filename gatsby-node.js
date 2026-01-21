/**
 * Gatsby Node API Configuration
 * 
 * This file implements programmatic redirects using Gatsby's createRedirect API.
 * Redirects are loaded from the central redirects.js configuration file.
 * 
 * See: https://www.gatsbyjs.org/docs/actions/#createRedirect
 */

const redirects = require('./redirects')

exports.createPages = ({ actions }) => {
  const { createRedirect } = actions

  // Create all redirects from the configuration file
  redirects.forEach(redirect => {
    createRedirect({
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
      isPermanent: redirect.isPermanent !== false, // Default to permanent (301)
      redirectInBrowser: true, // Enable client-side redirects
    })
  })
}
