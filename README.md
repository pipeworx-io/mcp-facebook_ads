# mcp-facebook_ads

Facebook Ads MCP Pack

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `fb_list_ad_accounts` | List all Facebook ad accounts you have access to. Returns account IDs, names, and status. |
| `fb_list_campaigns` | List campaigns in a Facebook ad account (e.g., account_id: '123456789'). Returns campaign names, IDs, status, and objectives. |
| `fb_get_campaign` | Get detailed campaign info: name, budget, status, schedule, and targeting. Requires account_id and campaign_id. |
| `fb_campaign_insights` | Get campaign performance metrics: impressions, clicks, spend, CTR, CPC, conversions, ROAS. Requires account_id and campaign_id. |
| `fb_list_adsets` | List ad sets in a campaign (e.g., account_id: '123456789', campaign_id: '987654321'). Returns names, IDs, status, budgets, and targeting. |

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/facebook_ads/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Facebook_ads data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
