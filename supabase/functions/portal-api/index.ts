import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

  const keyHash = await hashKey(apiKey);
  const { data: keyRecord, error: keyError } = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("key_hash", keyHash)
    .eq("is_active", true)
    .single();

  if (keyError || !keyRecord) return json({ error: "Invalid or inactive API key" }, 401);

  if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
    return json({ error: "API key has expired" }, 401);
  }

  supabaseAdmin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyRecord.id).then(() => {});

  const companyId = keyRecord.company_id;
  const permissions: string[] = keyRecord.permissions;
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/portal-api\/?/, "").replace(/^\//, "");
  const method = req.method;

  const resource = path.split("/")[0] || "";
  const resourceId = path.split("/")[1] || null;

  if (!permissions.includes(resource) && resource !== "") {
    return json({ error: `No permission for resource: ${resource}` }, 403);
  }

  if (!["GET", "POST", "PUT"].includes(method)) {
    return json({ error: "Method not allowed. Supported: GET, POST, PUT" }, 405);
  }

  try {
    // Helper to get company project IDs
    async function getCompanyProjectIds() {
      const { data: projects } = await supabaseAdmin
        .from("projects").select("id").eq("company_id", companyId).eq("visible_to_client", true);
      return (projects || []).map(p => p.id);
    }

    // Helper to verify a project belongs to this company
    async function verifyProjectOwnership(projectId: string): Promise<boolean> {
      const { data } = await supabaseAdmin
        .from("projects").select("id").eq("id", projectId).eq("company_id", companyId).single();
      return !!data;
    }

    switch (resource) {
      // ==================== PROJECTS ====================
      case "projects": {
        if (method === "GET") {
          const { data, error } = await supabaseAdmin
            .from("projects")
            .select("id, name, description, service_type, status, priority, progress, start_date, estimated_end_date, created_at, updated_at")
            .eq("company_id", companyId)
            .eq("visible_to_client", true);
          if (error) throw error;
          return json({ data });
        }

        if (method === "POST") {
          const body = await req.json();
          if (!body.name) return json({ error: "Field 'name' is required" }, 400);
          const { data, error } = await supabaseAdmin
            .from("projects")
            .insert({
              name: body.name,
              description: body.description || "",
              service_type: body.service_type || "custom",
              status: body.status || "active",
              priority: body.priority || "medium",
              start_date: body.start_date || null,
              estimated_end_date: body.estimated_end_date || null,
              company_id: companyId,
              visible_to_client: true,
            })
            .select("id, name, description, service_type, status, priority, progress, start_date, estimated_end_date, created_at, updated_at")
            .single();
          if (error) throw error;
          return json({ data }, 201);
        }

        if (method === "PUT") {
          if (!resourceId) return json({ error: "Project ID required in URL path: /projects/{id}" }, 400);
          if (!(await verifyProjectOwnership(resourceId))) return json({ error: "Project not found" }, 404);
          const body = await req.json();
          const updates: Record<string, unknown> = {};
          for (const field of ["name", "description", "service_type", "status", "priority", "progress", "start_date", "estimated_end_date"]) {
            if (body[field] !== undefined) updates[field] = body[field];
          }
          if (Object.keys(updates).length === 0) return json({ error: "No valid fields to update" }, 400);
          updates.updated_at = new Date().toISOString();
          const { data, error } = await supabaseAdmin
            .from("projects")
            .update(updates)
            .eq("id", resourceId)
            .eq("company_id", companyId)
            .select("id, name, description, service_type, status, priority, progress, start_date, estimated_end_date, created_at, updated_at")
            .single();
          if (error) throw error;
          return json({ data });
        }
        break;
      }

      // ==================== TASKS ====================
      case "tasks": {
        if (method === "GET") {
          const projectId = url.searchParams.get("project_id");
          let query = supabaseAdmin
            .from("tasks")
            .select("id, name, description, status, priority, due_date, completed_at, tags, created_at, updated_at, project_id, phase_id, milestone_id")
            .eq("visible_to_client", true);
          if (projectId) {
            query = query.eq("project_id", projectId);
          } else {
            const projectIds = await getCompanyProjectIds();
            if (projectIds.length === 0) return json({ data: [] });
            query = query.in("project_id", projectIds);
          }
          const { data, error } = await query;
          if (error) throw error;
          return json({ data });
        }

        if (method === "POST") {
          const body = await req.json();
          if (!body.name) return json({ error: "Field 'name' is required" }, 400);
          if (!body.project_id) return json({ error: "Field 'project_id' is required" }, 400);
          if (!(await verifyProjectOwnership(body.project_id))) return json({ error: "Project not found or not owned by your company" }, 403);
          const { data, error } = await supabaseAdmin
            .from("tasks")
            .insert({
              name: body.name,
              description: body.description || "",
              status: body.status || "todo",
              priority: body.priority || "medium",
              due_date: body.due_date || null,
              tags: body.tags || [],
              project_id: body.project_id,
              phase_id: body.phase_id || null,
              milestone_id: body.milestone_id || null,
              visible_to_client: body.visible_to_client ?? true,
            })
            .select("id, name, description, status, priority, due_date, tags, created_at, updated_at, project_id, phase_id, milestone_id")
            .single();
          if (error) throw error;
          return json({ data }, 201);
        }

        if (method === "PUT") {
          if (!resourceId) return json({ error: "Task ID required in URL path: /tasks/{id}" }, 400);
          const body = await req.json();
          const updates: Record<string, unknown> = {};
          for (const field of ["name", "description", "status", "priority", "due_date", "tags", "phase_id", "milestone_id", "visible_to_client"]) {
            if (body[field] !== undefined) updates[field] = body[field];
          }
          if (body.status === "done" && !updates.completed_at) updates.completed_at = new Date().toISOString();
          if (Object.keys(updates).length === 0) return json({ error: "No valid fields to update" }, 400);
          updates.updated_at = new Date().toISOString();
          // Verify task belongs to company
          const projectIds = await getCompanyProjectIds();
          const { data, error } = await supabaseAdmin
            .from("tasks")
            .update(updates)
            .eq("id", resourceId)
            .in("project_id", projectIds)
            .select("id, name, description, status, priority, due_date, completed_at, tags, created_at, updated_at, project_id, phase_id, milestone_id")
            .single();
          if (error) throw error;
          if (!data) return json({ error: "Task not found" }, 404);
          return json({ data });
        }
        break;
      }

      // ==================== MILESTONES ====================
      case "milestones": {
        if (method === "GET") {
          const projectId = url.searchParams.get("project_id");
          let query = supabaseAdmin
            .from("milestones")
            .select("id, name, description, status, due_date, completed_at, created_at, updated_at, project_id, phase_id")
            .eq("visible_to_client", true);
          if (projectId) {
            query = query.eq("project_id", projectId);
          } else {
            const projectIds = await getCompanyProjectIds();
            if (projectIds.length === 0) return json({ data: [] });
            query = query.in("project_id", projectIds);
          }
          const { data, error } = await query;
          if (error) throw error;
          return json({ data });
        }

        if (method === "POST") {
          const body = await req.json();
          if (!body.name) return json({ error: "Field 'name' is required" }, 400);
          if (!body.project_id) return json({ error: "Field 'project_id' is required" }, 400);
          if (!(await verifyProjectOwnership(body.project_id))) return json({ error: "Project not found or not owned by your company" }, 403);
          const { data, error } = await supabaseAdmin
            .from("milestones")
            .insert({
              name: body.name,
              description: body.description || "",
              status: body.status || "pending",
              due_date: body.due_date || null,
              project_id: body.project_id,
              phase_id: body.phase_id || null,
              visible_to_client: body.visible_to_client ?? true,
            })
            .select("id, name, description, status, due_date, completed_at, created_at, updated_at, project_id, phase_id")
            .single();
          if (error) throw error;
          return json({ data }, 201);
        }

        if (method === "PUT") {
          if (!resourceId) return json({ error: "Milestone ID required in URL path: /milestones/{id}" }, 400);
          const body = await req.json();
          const updates: Record<string, unknown> = {};
          for (const field of ["name", "description", "status", "due_date", "phase_id", "visible_to_client"]) {
            if (body[field] !== undefined) updates[field] = body[field];
          }
          if (body.status === "completed" && !updates.completed_at) updates.completed_at = new Date().toISOString();
          if (Object.keys(updates).length === 0) return json({ error: "No valid fields to update" }, 400);
          updates.updated_at = new Date().toISOString();
          const projectIds = await getCompanyProjectIds();
          const { data, error } = await supabaseAdmin
            .from("milestones")
            .update(updates)
            .eq("id", resourceId)
            .in("project_id", projectIds)
            .select("id, name, description, status, due_date, completed_at, created_at, updated_at, project_id, phase_id")
            .single();
          if (error) throw error;
          if (!data) return json({ error: "Milestone not found" }, 404);
          return json({ data });
        }
        break;
      }

      // ==================== UPDATES ====================
      case "updates": {
        if (method === "GET") {
          const projectId = url.searchParams.get("project_id");
          let query = supabaseAdmin
            .from("project_updates")
            .select("id, title, summary, what_was_done, current_status, next_steps, client_action_needed, published_at, created_at, project_id")
            .eq("status", "published");
          if (projectId) {
            query = query.eq("project_id", projectId);
          } else {
            const projectIds = await getCompanyProjectIds();
            if (projectIds.length === 0) return json({ data: [] });
            query = query.in("project_id", projectIds);
          }
          const { data, error } = await query;
          if (error) throw error;
          return json({ data });
        }

        if (method === "POST") {
          const body = await req.json();
          if (!body.title) return json({ error: "Field 'title' is required" }, 400);
          if (!body.project_id) return json({ error: "Field 'project_id' is required" }, 400);
          if (!(await verifyProjectOwnership(body.project_id))) return json({ error: "Project not found or not owned by your company" }, 403);
          const { data, error } = await supabaseAdmin
            .from("project_updates")
            .insert({
              title: body.title,
              summary: body.summary || "",
              what_was_done: body.what_was_done || "",
              current_status: body.current_status || "",
              next_steps: body.next_steps || "",
              client_action_needed: body.client_action_needed || "",
              project_id: body.project_id,
              status: body.publish ? "published" : "draft",
              published_at: body.publish ? new Date().toISOString() : null,
            })
            .select("id, title, summary, what_was_done, current_status, next_steps, client_action_needed, status, published_at, created_at, project_id")
            .single();
          if (error) throw error;
          return json({ data }, 201);
        }

        if (method === "PUT") {
          if (!resourceId) return json({ error: "Update ID required in URL path: /updates/{id}" }, 400);
          const body = await req.json();
          const updates: Record<string, unknown> = {};
          for (const field of ["title", "summary", "what_was_done", "current_status", "next_steps", "client_action_needed"]) {
            if (body[field] !== undefined) updates[field] = body[field];
          }
          if (body.publish === true) {
            updates.status = "published";
            updates.published_at = new Date().toISOString();
          }
          if (Object.keys(updates).length === 0) return json({ error: "No valid fields to update" }, 400);
          updates.updated_at = new Date().toISOString();
          const projectIds = await getCompanyProjectIds();
          const { data, error } = await supabaseAdmin
            .from("project_updates")
            .update(updates)
            .eq("id", resourceId)
            .in("project_id", projectIds)
            .select("id, title, summary, what_was_done, current_status, next_steps, client_action_needed, status, published_at, created_at, project_id")
            .single();
          if (error) throw error;
          if (!data) return json({ error: "Update not found" }, 404);
          return json({ data });
        }
        break;
      }

      // ==================== FILES ====================
      case "files": {
        if (method === "GET") {
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

        if (method === "POST") {
          const body = await req.json();
          if (!body.name) return json({ error: "Field 'name' is required" }, 400);
          if (!body.file_url) return json({ error: "Field 'file_url' is required" }, 400);
          if (body.project_id && !(await verifyProjectOwnership(body.project_id))) {
            return json({ error: "Project not found or not owned by your company" }, 403);
          }
          const { data, error } = await supabaseAdmin
            .from("files")
            .insert({
              name: body.name,
              file_url: body.file_url,
              file_type: body.file_type || "",
              file_size: body.file_size || 0,
              category: body.category || "other",
              project_id: body.project_id || null,
              company_id: companyId,
              visible_to_client: body.visible_to_client ?? true,
            })
            .select("id, name, file_url, file_type, file_size, category, version, created_at, project_id")
            .single();
          if (error) throw error;
          return json({ data }, 201);
        }

        if (method === "PUT") {
          if (!resourceId) return json({ error: "File ID required in URL path: /files/{id}" }, 400);
          const body = await req.json();
          const updates: Record<string, unknown> = {};
          for (const field of ["name", "file_url", "file_type", "file_size", "category", "visible_to_client"]) {
            if (body[field] !== undefined) updates[field] = body[field];
          }
          if (Object.keys(updates).length === 0) return json({ error: "No valid fields to update" }, 400);
          const { data, error } = await supabaseAdmin
            .from("files")
            .update(updates)
            .eq("id", resourceId)
            .eq("company_id", companyId)
            .select("id, name, file_url, file_type, file_size, category, version, created_at, project_id")
            .single();
          if (error) throw error;
          if (!data) return json({ error: "File not found" }, 404);
          return json({ data });
        }
        break;
      }

      // ==================== ROOT ====================
      case "": {
        return json({
          message: "HAT3X Portal API v1",
          endpoints: permissions.map(p => `/${p}`),
          methods: ["GET", "POST", "PUT"],
          docs: "Use x-api-key header for authentication. GET to list, POST to create, PUT /{resource}/{id} to update.",
        });
        break;
      }

      default:
        return json({ error: `Unknown resource: ${resource}` }, 404);
    }

    return json({ error: "Method not allowed for this resource" }, 405);
  } catch (err) {
    console.error("API error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
