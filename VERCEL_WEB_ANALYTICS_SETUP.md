# Vercel Web Analytics Setup Guide

This document describes how Vercel Web Analytics has been integrated into this React + Vite portfolio project.

## Overview

Vercel Web Analytics is enabled and fully configured for this project. It tracks visitor traffic, page views, and provides insights into user behavior to help you understand your site's performance and audience engagement.

## Prerequisites

- A Vercel account (you can [sign up for free](https://vercel.com/signup))
- A Vercel project deployed on Vercel
- The Vercel CLI installed (optional, but recommended)

To install Vercel CLI:

```bash
# Using pnpm
pnpm i vercel

# Using yarn
yarn i vercel

# Using npm
npm i vercel

# Using bun
bun i vercel
```

## Installation

The `@vercel/analytics` package is already installed in this project. To verify, check your `package.json` file:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.6.1"
  }
}
```

## Enable Web Analytics in Vercel

Before the tracking begins, you need to enable Web Analytics in your Vercel project:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to the **Analytics** tab
4. Click **Enable** from the dialog

**💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Integration Details

### React Component Integration

The Analytics component is integrated in `src/App.jsx`:

```jsx
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  return (
    // ... your app content ...
    <>
      {/* Your components */}
      <Analytics />
    </>
  );
}
```

**Location in code:** The `<Analytics />` component is placed at the bottom of the main App component, just before the closing main tag. This ensures it tracks the entire application.

### Why This Approach

- **React-specific import:** We use `@vercel/analytics/react` instead of the generic version for better integration with React, including automatic route support
- **Automatic tracking:** The component automatically tracks page views and visitor interactions
- **Zero configuration:** The component works out-of-the-box without additional setup
- **Performance optimized:** Uses non-blocking requests that don't impact user experience

## Deployment Requirements

### Deploy Your App to Vercel

Deploy your app using the Vercel CLI or Git connection:

```bash
# Using Vercel CLI
vercel deploy

# Or connect your Git repository to Vercel for automatic deployments
```

If you haven't already, it's recommended to [connect your project's Git repository](https://vercel.com/docs/git), which enables Vercel to deploy your latest commits automatically.

### Verification

Once your app is deployed, you can verify that Web Analytics is working:

1. Visit your deployed site
2. Open your browser's **Developer Tools** → **Network** tab
3. Look for a **Fetch/XHR** request to `/_vercel/insights/view`
4. This confirms that analytics data is being collected

## Data Collection

After deployment and enabling Web Analytics in the Vercel dashboard:

1. Visitors need to access your site for data to be collected
2. Web Analytics data appears in the Vercel dashboard after collection begins
3. You'll start seeing data including:
   - Total page views and visitors
   - Top performing pages
   - Traffic sources and referrers
   - Device and browser information
   - Geographic data

After a few days of visitor traffic, you can explore your data by:

1. Going to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecting your project
3. Clicking the **Analytics** tab
4. Viewing and filtering the available data panels

## What Gets Tracked

Web Analytics automatically tracks:

- **Page Views:** Every page visited on your site
- **Visitors:** Unique visitors to your site
- **Referrers:** Where your visitors are coming from
- **Device Information:** Browser, OS, and device type
- **Geographic Data:** Country, region, and city of visitors
- **Page Performance:** Core Web Vitals and load times

## Custom Events (Pro and Enterprise Plans)

If you're on a Pro or Enterprise plan, you can add custom events to track specific user interactions:

```jsx
import { Analytics } from "@vercel/analytics/react"

function MyComponent() {
  const handleClick = () => {
    // Track custom event
    window.va?.('event', {
      name: 'Button Click',
      value: 'Custom Value'
    });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

For more information, see the [custom events documentation](https://vercel.com/docs/analytics/custom-events).

## Deployment Pipeline

This project follows this deployment pipeline:

1. Code is committed to Git
2. Vercel automatically deploys the latest commit
3. After deployment, the `/_vercel/insights/*` routes become available
4. Web Analytics begins collecting data from visitors
5. Data appears in the Vercel Analytics dashboard

## Next Steps

Now that Vercel Web Analytics is set up, you can:

- [Learn how to use the `@vercel/analytics` package](https://vercel.com/docs/analytics/package)
- [Set up custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Read about privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting common issues](https://vercel.com/docs/analytics/troubleshooting)

## Additional Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [@vercel/analytics Package Documentation](https://vercel.com/docs/analytics/package)
- [Web Analytics Filtering Guide](https://vercel.com/docs/analytics/filtering)
- [Privacy and Compliance Information](https://vercel.com/docs/analytics/privacy-policy)

## Integration with Speed Insights

This project also uses Vercel Speed Insights (`@vercel/speed-insights`) for performance monitoring. Both services work together to provide comprehensive insights:

- **Web Analytics:** Tracks user behavior and traffic patterns
- **Speed Insights:** Tracks performance metrics and Core Web Vitals

Together, they provide a complete picture of your application's user experience and performance.

## Troubleshooting

### Analytics data not appearing

1. Ensure Web Analytics is enabled in the Vercel Dashboard
2. Check that the site has been deployed to Vercel
3. Verify that visitors have actually accessed the site
4. Check the Network tab in DevTools for requests to `/_vercel/insights/view`
5. Allow 5-10 minutes for data to appear in the dashboard

### Missing routes

If the `/_vercel/insights/*` routes are not available:

1. Redeploy your application to Vercel
2. Clear your browser cache
3. Check the deployment logs for errors

For additional help, see the [troubleshooting guide](https://vercel.com/docs/analytics/troubleshooting).
