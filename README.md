# Claude Code Starter Template

A production-ready starter repository for [Claude Code](https://claude.com/claude-code) containing pre-configured AI agents, custom commands, and design review workflows.

## What's Included

### 🤖 Specialized Agents
Pre-built AI agents in `.claude/agents/` for:
- **Content Creation**: Blog writing, newsletter drafting, SEO content
- **Market Research**: Competitive analysis, data analysis, market reports
- **Design & Development**: Design reviews, premium UI components, SEO optimization
- **Personal Development**: Daily reflections, weekly metrics tracking

### ⚡ Custom Commands
Ready-to-use slash commands in `.claude/commands/`:
- `/blog-research` - Analyze competitors and create SEO-optimized drafts
- `/market-research` - Generate comprehensive market research studies
- `/website-research` - SEO audits and competitive analysis
- `/press-release` - Create media-ready press releases
- `/youtube-research` - YouTube content and SEO analysis
- `/daily-checkin` - Personal reflection and well-being tracking
- `/weekly-checkin` - Intelligent progress tracking

### 🎨 Design Review System
World-class design review workflows in `context/`:
- S-tier SaaS dashboard design principles
- Automated visual regression testing
- Accessibility and responsiveness validation
- Playwright-powered browser automation

## Quick Start

1. **Clone or copy this repository structure to your project:**
   ```bash
   # Copy the entire starter template
   cp -r .claude/ your-project/.claude/
   cp -r context/ your-project/context/
   ```

2. **Customize for your project:**
   - Edit `.claude/agents/` to add project-specific agents
   - Modify `.claude/commands/` to include your workflows
   - Create a project-specific `CLAUDE.md` with your architecture

3. **Start using commands:**
   ```bash
   # In Claude Code
   /blog-research
   /market-research research-brief.md
   /website-research https://example.com
   ```

## Repository Structure

```
.claude/
├── agents/          # AI agents for specialized tasks
│   ├── blog-writer.md
│   ├── content-analyzer.md
│   ├── design-review-agent.md
│   ├── market-researcher.md
│   └── ... (15+ agents)
├── commands/        # Slash commands for workflows
│   ├── blog-research.md
│   ├── market-research.md
│   ├── daily-checkin.md
│   └── ... (10+ commands)
└── subagents/       # Supporting agents

context/
├── design-principles.md              # S-tier design checklist
├── design-review-claude-md-snippet.md
└── design-review-slash-command.md

CLAUDE.md            # Claude Code instructions (global)
```

## Key Features

### Content & Research Agents
- **Blog Writer**: Creates 1,200-2,000 word publication-ready posts
- **Content Analyzer**: Identifies trends and gaps in competitor content
- **Newsletter Writer**: Drafts newsletters in your authentic voice
- **Market Researcher**: Comprehensive market research with executive summaries

### Design & Development
- **Design Review Agent**: Automated visual testing with Playwright
- **Premium UI Designer**: Sophisticated components with premium aesthetics
- **Meta SEO Agent**: Implements SEO meta tags and schema markup

### Personal Development
- **Daily Checkin**: Personal reflection and mood tracking
- **Weekly Checkin**: Adaptive metrics tracking for your specific projects
- **Metrics Analyst**: Visual trends and insights over time

## Creating New Agents

Use the built-in meta-agent:

```bash
/meta-agent
```

Or manually create in `.claude/agents/` following this structure:

```markdown
---
name: your-agent-name
description: What this agent does
tools: Read, Write, WebFetch
color: blue
model: sonnet
---

[Agent instructions here]
```

## Design Review Workflow

### Quick Visual Check
After any UI change:
1. Navigate to modified pages using Playwright
2. Verify against `context/design-principles.md`
3. Capture screenshots (1440px viewport)
4. Check console for errors

### Comprehensive Review
Use the design-review agent:
```bash
/design-review
```

Based on Stripe, Airbnb, and Linear design standards.

## Using This Template

**For a new project:**
1. Copy `.claude/` and `context/` directories
2. Keep relevant agents and commands
3. Remove unused workflows
4. Create project-specific `CLAUDE.md`
5. Customize agents for your domain

**For an existing project:**
1. Copy individual agents/commands you need
2. Merge with existing `.claude/` structure
3. Update `CLAUDE.md` with new commands

## Requirements

- [Claude Code](https://claude.com/claude-code)
- Optional: Playwright MCP for design review workflows
- Optional: Firecrawl MCP for web scraping features

## Documentation

Full documentation in `CLAUDE.md` includes:
- Detailed command usage
- Agent capabilities and workflows
- Design principles and standards
- Creating custom agents and commands

## Examples

**Create a blog post:**
```bash
/blog-research
```
Analyzes competitor blogs, identifies trends, writes SEO-optimized 1,200-2,000 word draft.

**Run market research:**
```bash
/market-research research-brief.md
```
Generates executive summary, competitive analysis, and strategic recommendations.

**Audit a website:**
```bash
/website-research https://competitor.com
```
Technical SEO audit, keyword extraction, competitive intelligence.

## Contributing

This is a starter template. Fork it, customize it, make it your own.

## License

MIT - Use freely for personal and commercial projects.

---

**Built for [Claude Code](https://claude.com/claude-code)** - AI-powered development automation
