export async function onRequest(context) {
  const { request, env } = context;
  const origin = request.headers.get("Origin") || "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  const url = new URL(request.url);
  if (!url.pathname.startsWith("/nav")) {
    return new Response("Not Found", { status: 404 });
  }

  // 处理预检请求
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // GET: 查询所有导航，分组返回
  if (request.method === "GET") {
    try {
      const { results } = await env.nav_table.prepare(
        "SELECT id, group_name, name, url, icon FROM nav_table"
      ).all();

      // 分组
      const grouped = {};
      for (const item of results) {
        if (!grouped[item.group_name]) grouped[item.group_name] = [];
        grouped[item.group_name].push({
          id: item.id,
          name: item.name,
          url: item.url,
          icon: item.icon
        });
      }
      const groups = Object.keys(grouped).map(groupName => ({
        name: groupName,
        list: grouped[groupName]
      }));

      return new Response(JSON.stringify(groups), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }

  // POST: 新增导航（支持单条/多条）
  if (request.method === "POST") {
    try {
      const body = await request.json();
      // 支持单条或多条
      const items = Array.isArray(body) ? body : [body];
      let count = 0;
      for (const item of items) {
        if (!item.group_name || !item.name || !item.url) continue;
        await env.nav_table.prepare(
          "INSERT INTO nav_table (group_name, name, url, icon) VALUES (?, ?, ?, ?)"
        ).bind(item.group_name, item.name, item.url, item.icon || "").run();
        count++;
      }
      return new Response(JSON.stringify({ success: true, inserted: count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }

  // PUT: 修改导航（按 id）
  if (request.method === 'PUT' && url.pathname.startsWith('/nav/')) {
    const id = url.pathname.split('/').pop();
    const body = await request.json();
    await env.nav_table.prepare(
      'UPDATE nav_table SET group_name=?, name=?, url=?, icon=? WHERE id=?'
    ).bind(body.group_name, body.name, body.url, body.icon, id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // DELETE: 删除导航（按 id）
  if (request.method === "DELETE") {
    try {
      // 支持 id 通过 ?id=xxx 传递，或 body 传递
      let id = url.searchParams.get("id");
      if (!id && request.headers.get("content-type")?.includes("application/json")) {
        const body = await request.json();
        id = body.id;
      }
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      await env.nav_table.prepare("DELETE FROM nav_table WHERE id=?").bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }

  // 其它方法
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}