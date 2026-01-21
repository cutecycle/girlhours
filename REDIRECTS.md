# Redirect System

This site now has a comprehensive redirect system that works across different hosting platforms.

## How to Add Redirects

There are two files you can use to manage redirects:

### 1. For All Hosting Platforms (Recommended)

Edit `/redirects.js` to add new redirects:

```javascript
module.exports = [
  {
    fromPath: '/old-page',
    toPath: '/new-page',
    isPermanent: true, // true for 301, false for 302
  },
  {
    fromPath: '/blog',
    toPath: '/posts',
    isPermanent: true,
  },
]
```

This method:
- ✅ Works on any hosting platform
- ✅ Centralized configuration
- ✅ Supports both permanent (301) and temporary (302) redirects
- ✅ Automatic client-side redirects

### 2. For Netlify/Vercel (Optional, Faster)

Edit `/static/_redirects` for hosting-level redirects:

```
/old-page  /new-page  301
/blog      /posts     301
/temp      /new-temp  302
```

This method:
- ✅ Faster (processed before app loads)
- ✅ Only works on Netlify, Vercel, and similar platforms
- ⚠️ Not needed if using `redirects.js`

## Which Method to Use?

- **Use `redirects.js`** if you want a simple, centralized solution that works everywhere
- **Use `static/_redirects`** if you're on Netlify/Vercel and want the fastest possible redirects
- **Use both** if you want hosting-level redirects (when available) with fallback to Gatsby redirects

## Examples

### Redirect a renamed page:
```javascript
{
  fromPath: '/about',
  toPath: '/about-us',
  isPermanent: true,
}
```

### Redirect old blog URLs:
```javascript
{
  fromPath: '/blog/2020/my-post',
  toPath: '/posts/my-post',
  isPermanent: true,
}
```

### Temporary redirect:
```javascript
{
  fromPath: '/maintenance',
  toPath: '/under-construction',
  isPermanent: false,
}
```

## Testing Redirects

After adding redirects:

1. Build the site: `npm run build`
2. Serve locally: `npm run serve`
3. Test the redirect by visiting the old URL

## More Information

- [Gatsby Redirects Documentation](https://www.gatsbyjs.org/docs/actions/#createRedirect)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)
- [Vercel Redirects](https://vercel.com/docs/edge-network/redirects)
