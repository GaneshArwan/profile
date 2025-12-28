# Vercel Speed Insights Setup Guide

This document describes how Vercel Speed Insights has been integrated into this React + Vite portfolio project.

## Overview

Vercel Speed Insights is enabled and fully configured for this project. It tracks Web Vitals and provides performance metrics to help optimize the site's user experience.

## Installation

The `@vercel/speed-insights` package is already installed in this project. To verify installation, you can check your `package.json` file:

```json
{
  "dependencies": {
    "@vercel/speed-insights": "^1.3.1"
  }
}
```

## Integration Details

### React Component Integration

The SpeedInsights component is integrated in `src/App.jsx`:

```jsx
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  return (
    // ... your app content ...
    <>
      {/* Your components */}
      <SpeedInsights />
    </>
  );
}
```

**Location in code:** The `<SpeedInsights />` component is placed at the bottom of the main App component, just before the closing main tag. This ensures it tracks the entire application.

### Why This Approach

- **React-specific import:** We use `@vercel/speed-insights/react` instead of the generic version for better integration with React
- **Automatic tracking:** The component automatically tracks Core Web Vitals (LCP, FID, CLS) and other performance metrics
- **No configuration needed:** The component works out-of-the-box without additional setup

## Deployment Requirements

### Vercel Dashboard Setup

Before Speed Insights data appears in your dashboard, you need to:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to the **Speed Insights** tab
4. Click **Enable** in the dialog

**Note:** Enabling Speed Insights will add new routes scoped at `/_vercel/speed-insights/*` after your next deployment.

### Deployment

Deploy your app to Vercel using:

```bash
vercel deploy
```

Or connect your Git repository to Vercel for automatic deployments.

## Data Collection

After deployment:

1. Users need to visit your site for data to be collected
2. Speed Insights data appears in the Vercel dashboard after collection begins
3. You can view performance metrics, identify bottlenecks, and track improvements over time

## What Gets Tracked

Speed Insights automatically tracks:

- **LCP (Largest Contentful Paint):** When the largest content element appears
- **FID (First Input Delay):** Responsiveness to user input
- **CLS (Cumulative Layout Shift):** Visual stability of the page
- **TTFB (Time to First Byte):** Server response time
- **Custom metrics:** Additional performance data points

## Next Steps

- Deploy the application to Vercel
- Enable Speed Insights in the Vercel dashboard
- Monitor metrics in the [Speed Insights dashboard](https://vercel.com/docs/speed-insights)
- Use the insights to optimize performance

## Additional Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [@vercel/speed-insights Package](https://vercel.com/docs/speed-insights/package)
- [Web Vitals Guide](https://web.dev/vitals/)

## Analytics Integration

This project also uses Vercel Analytics (`@vercel/analytics`) for additional data collection. Both services work together to provide comprehensive insights into your application's performance and user behavior.

```jsx
import { Analytics } from "@vercel/analytics/react"
// ... in your component
<Analytics />
```
