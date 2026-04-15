interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Facebook Ads MCP Pack
 *
 * Requires OAuth connection — gateway injects credentials via _context.facebook_ads.
 * Wraps the Facebook Marketing API (Graph API v19.0).
 */


const API = 'https://graph.facebook.com/v19.0';

interface FacebookAdsContext {
  facebook_ads?: { accessToken: string };
}

async function fbFetch(ctx: FacebookAdsContext, path: string, params: Record<string, string> = {}) {
  if (!ctx.facebook_ads) {
    return { error: 'connection_required', message: 'Connect your Facebook Ads account at https://pipeworx.io/account' };
  }
  const { accessToken } = ctx.facebook_ads;
  const qs = new URLSearchParams({ access_token: accessToken, ...params });
  const res = await fetch(`${API}${path}?${qs}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Facebook Ads API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'fb_list_ad_accounts',
    description: 'List all ad accounts accessible by the authenticated Facebook user.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        fields: { type: 'string', description: 'Comma-separated fields (default: "id,name,account_status,currency,balance")' },
        limit: { type: 'number', description: 'Max results (default 25)' },
      },
    },
  },
  {
    name: 'fb_list_campaigns',
    description: 'List campaigns for a Facebook ad account.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        act_account_id: { type: 'string', description: 'Ad account ID with act_ prefix (e.g., "act_123456789")' },
        fields: { type: 'string', description: 'Comma-separated fields (default: "id,name,status,objective,daily_budget,lifetime_budget")' },
        limit: { type: 'number', description: 'Max results (default 25)' },
      },
      required: ['act_account_id'],
    },
  },
  {
    name: 'fb_get_campaign',
    description: 'Get details for a specific Facebook Ads campaign.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID' },
        fields: { type: 'string', description: 'Comma-separated fields (default: "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time")' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'fb_campaign_insights',
    description: 'Get performance insights (impressions, clicks, spend, etc.) for a campaign.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID' },
        date_preset: { type: 'string', description: 'Date preset (e.g., "today", "yesterday", "last_7d", "last_30d", "this_month")' },
        time_range_since: { type: 'string', description: 'Start date YYYY-MM-DD (use instead of date_preset)' },
        time_range_until: { type: 'string', description: 'End date YYYY-MM-DD (use with time_range_since)' },
        fields: { type: 'string', description: 'Comma-separated metrics (default: "impressions,clicks,spend,ctr,cpc,cpm,reach,actions")' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'fb_list_adsets',
    description: 'List ad sets for a specific campaign.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID' },
        fields: { type: 'string', description: 'Comma-separated fields (default: "id,name,status,daily_budget,lifetime_budget,targeting,optimization_goal")' },
        limit: { type: 'number', description: 'Max results (default 25)' },
      },
      required: ['campaign_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const context = (args._context ?? {}) as FacebookAdsContext;
  delete args._context;

  switch (name) {
    case 'fb_list_ad_accounts': {
      const fields = (args.fields as string) ?? 'id,name,account_status,currency,balance';
      const limit = String((args.limit as number) ?? 25);
      return fbFetch(context, '/me/adaccounts', { fields, limit });
    }

    case 'fb_list_campaigns': {
      const accountId = args.act_account_id as string;
      const fields = (args.fields as string) ?? 'id,name,status,objective,daily_budget,lifetime_budget';
      const limit = String((args.limit as number) ?? 25);
      return fbFetch(context, `/${accountId}/campaigns`, { fields, limit });
    }

    case 'fb_get_campaign': {
      const campaignId = args.campaign_id as string;
      const fields = (args.fields as string) ?? 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time';
      return fbFetch(context, `/${campaignId}`, { fields });
    }

    case 'fb_campaign_insights': {
      const campaignId = args.campaign_id as string;
      const fields = (args.fields as string) ?? 'impressions,clicks,spend,ctr,cpc,cpm,reach,actions';
      const params: Record<string, string> = { fields };

      if (args.time_range_since && args.time_range_until) {
        params.time_range = JSON.stringify({
          since: args.time_range_since as string,
          until: args.time_range_until as string,
        });
      } else if (args.date_preset) {
        params.date_preset = args.date_preset as string;
      } else {
        params.date_preset = 'last_30d';
      }

      return fbFetch(context, `/${campaignId}/insights`, params);
    }

    case 'fb_list_adsets': {
      const campaignId = args.campaign_id as string;
      const fields = (args.fields as string) ?? 'id,name,status,daily_budget,lifetime_budget,targeting,optimization_goal';
      const limit = String((args.limit as number) ?? 25);
      return fbFetch(context, `/${campaignId}/adsets`, { fields, limit });
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 15 }, provider: 'facebook_ads' } satisfies McpToolExport;
