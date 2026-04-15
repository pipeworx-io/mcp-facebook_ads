# mcp-facebook_ads

Facebook Ads MCP Pack

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `fb_list_ad_accounts` | List all ad accounts accessible by the authenticated Facebook user. |
| `fb_list_campaigns` | List campaigns for a Facebook ad account. |
| `fb_get_campaign` | Get details for a specific Facebook Ads campaign. |
| `fb_campaign_insights` | Get performance insights (impressions, clicks, spend, etc.) for a campaign. |
| `fb_list_adsets` | List ad sets for a specific campaign. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "facebook_ads": {
      "url": "https://gateway.pipeworx.io/facebook_ads/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use facebook_ads
```

## License

MIT
