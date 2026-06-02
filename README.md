# mcp-facebook_ads

Facebook Ads MCP Pack

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `fb_list_ad_accounts` | List all Facebook ad accounts you have access to. Returns account IDs, names, and status. |
| `fb_list_campaigns` | List campaigns in a Facebook ad account (e.g., account_id: \'123456789\'). Returns campaign names, IDs, status, and objectives. |
| `fb_get_campaign` | Get detailed campaign info: name, budget, status, schedule, and targeting. Requires account_id and campaign_id. |
| `fb_campaign_insights` | Get campaign performance metrics: impressions, clicks, spend, CTR, CPC, conversions, ROAS. Requires account_id and campaign_id. |
| `fb_list_adsets` | List ad sets in a campaign (e.g., account_id: \'123456789\', campaign_id: \'987654321\'). Returns names, IDs, status, budgets, and targeting. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "facebook_ads": {
      "url": "https://gateway.pipeworx.io/facebook_ads/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Facebook_ads data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
