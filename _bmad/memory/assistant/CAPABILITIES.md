# Capabilities

## Built-in

| Code | Name | Description | Source |
|------|------|-------------|--------|
| [IB] | intake-and-brief | Turn any incoming request into either immediate dispatch or a confirmed brief | `references/intake-brief.md` |
| [RR] | registry-refresh | Rebuild the agent registry so new skills are routable without being taught | `references/registry-refresh.md` |
| [RD] | route-dispatch | Pick the right specialist skill(s), delegate with a complete brief, and report back with flags | `references/route-dispatch.md` |

## Learned

_Capabilities added by the owner over time. Prompts live in `capabilities/`._

| Code | Name | Description | Source | Added |
|------|------|-------------|--------|-------|

## How to Add a Capability

Tell me "I want you to be able to do X" and we'll create it together.
I'll write the prompt, save it to `capabilities/`, and register it here.
Next session, I'll know how.
Load `references/capability-authoring.md` for the full creation framework.

## Tools

Prefer crafting your own tools over depending on external ones. A script you wrote and saved is more reliable than an external API. Use the file system creatively.

### User-Provided Tools

_MCP servers, APIs, or services the owner has made available. Document them here._
