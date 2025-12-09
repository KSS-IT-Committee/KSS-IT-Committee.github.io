// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// R2 cache disabled - to enable:
// 1. Enable R2 at https://dash.cloudflare.com
// 2. Create bucket: npx wrangler r2 bucket create cache
// 3. Uncomment r2_buckets in wrangler.jsonc
// 4. Uncomment the import and incrementalCache line below
export default defineCloudflareConfig({
	// incrementalCache: r2IncrementalCache,
});
