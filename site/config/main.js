/**
 * Cook build config for the vb-design-system documentation mini-site.
 */
export default {
  srcPath: 'src',
  distPath: 'dist',
  buildOnlyPaths: ['layouts', 'includes'],
  plugins: {
    before: [],
    default: ['generate-api-tables'],
    after: [],
  },
  pluginPath: 'plugins',
  // Pre-built vendor bundles must be copied verbatim, never HTML-parsed. cook's
  // default excludePath (/dist/assets/vendor/) doesn't match our /dist/pages/…
  // output, so it was running linkedom over the bundles and mangling any markup-
  // like strings (e.g. chart-wc.js's "<![CDATA[", "<!DOCTYPE svg", "x<\"u\"") —
  // breaking the burndown chart. Exclude the vendor dir from modification.
  excludePaths: [/assets\/vendor/],
  images: { enabled: false },
  formats: { markdown: false, json: false, feed: null, llmsTxt: false },
  fragments: { enabled: false },
};
