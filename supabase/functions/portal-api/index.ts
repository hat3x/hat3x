import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function hashKey(key: string): Promise<string> {
  const encoded = new TextEncoder().encode(key);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return json({ error: "Missing x-api-key header" }, 401);

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Validate API key
  const keyHash = await hashKey(apiKey);
  const { data: keyRecord, error: keyError } = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("key_hash", keyHash)
    .eq("is_active", true)
    .single();

  if (keyError || !keyRecord) return json({ error: "Invalid or inactive API key" }, 401);

  // Check expiration
  if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
    return json({ error: "API key has expired" }, 401);
  }

  // Update last_used_at
  supabaseAdmin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyRecord.id).then(() => {});

  const companyId = keyRecord.company_id;
  const permissions: string[] = keyRecord.permissions;
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/portal-api\/?/, "").replace(/^\//, "");

  // Route handling
  if (req.method !== "GET") return json({ error: "Only GET requests are supported" }, 405);

  const resource = path.split("/")[0] || "";

  if (!permissions.includes(resource) && resource !== "") {
    return json({ error: `No permission for resource: ${resource}` }, 403);
  }

  try {
    switch (resource) {
      case "projects": {
        const { data, error } = await supabaseAdmin
          .from("projects")
          .select("id, name, description, service_type, status, priority, progress, start_date, estimated_end_date, created_at, updated_at")
          .eq("company_id", companyId)
          .eq("visible_to_client", true);
        if (error) throw error;
        return json({ data });
      }

      case "tasks": {
        const projectId = url.searchParams.get("project_id");
        let query = supabaseAdmin
          .from("tasks")
          .select("id, name, description, status, priority, due_date, completed_at, tags, created_at, updated_at, project_id, phase_id, milestone_id")
          .eq("visible_to_client", true);
        
        if (projectId) {
          query = query.eq("project_id", projectId);
        } else {
          // Filter to company projects
          const { data: projects } = await supabaseAdmin
            .from("projects").select("id").eq("company_id", companyId).eq("visible_to_client", true);
          const projectIds = (projects || []).map(p => p.id);
          if (projectIds.length === 0) return json({ data: [] });
          query = query.in("project_id", projectIds);
        }
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case "milestones": {
        const projectId = url.searchParams.get("project_id");
        let query = supabaseAdmin
          .from("milestones")
          .select("id, name, description, status, due_date, completed_at, created_at, updated_at, project_id, phase_id")
          .eq("visible_to_client", true);
        
        if (projectId) {
          query = query.eq("project_id", projectId);
        } else {
          const { data: projects } = await supabaseAdmin
            .from("projects").select("id").eq("company_id", companyId).eq("visible_to_client", true);
          const projectIds = (projects || []).map(p => p.id);
          if (projectIds.length === 0) return json({ data: [] });
          query = query.in("project_id", projectIds);
        }
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case "updates": {
        const projectId = url.searchParams.get("project_id");
        let query = supabaseAdmin
          .from("project_updates")
          .select("id, title, summary, what_was_done, current_status, next_steps, client_action_needed, published_at, created_at, project_id")
          .eq("status", "published");
        
        if (projectId) {
          query = query.eq("project_id", projectId);
        } else {
          const { data: projects } = await supabaseAdmin
            .from("projects").select("id").eq("company_id", companyId).eq("visible_to_client", true);
          const projectIds = (projects || []).map(p => p.id);
          if (projectIds.length === 0) return json({ data: [] });
          query = query.in("project_id", projectIds);
        }
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case "files": {
        const projectId = url.searchParams.get("project_id");
        let query = supabaseAdmin
          .from("files")
          .select("id, name, file_url, file_type, file_size, category, version, created_at, project_id")
          .eq("visible_to_client", true);
        
        if (projectId) {
          query = query.eq("project_id", projectId);
        } else {
          query = query.or(`company_id.eq.${companyId}`);
        }
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case "": {
        return json({
          message: "HAT3X Portal API v1",
          endpoints: permissions.map(p => `/${p}`),
          docs: "Use x-api-key header for authentication. All endpoints support GET.",
        });
      }

      default:
        return json({ error: `Unknown resource: ${resource}` }, 404);
    }
  } catch (err) {
    console.error("API error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
