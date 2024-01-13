/**
 * Setup for vercel deployment
  * resources:
  *   https://github.com/vercel/next.js/discussions/12373
*/
module.exports = {
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: './index.html',
      },
    ]
  },
}
