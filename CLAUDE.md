# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **starter template** repository containing pre-configured Claude Code agents, commands, and design review workflows. It serves as a reusable foundation for new projects rather than an active application codebase.

## Repository Structure

```
.claude/
├── agents/          # Specialized AI agents for content, research, and design tasks
├── commands/        # Custom slash commands for common workflows
└── subagents/       # Supporting agents for specific sub-tasks

context/             # Design principles and review guidelines
├── design-principles.md              # S-tier SaaS dashboard design checklist
├── design-review-claude-md-snippet.md  # Quick visual check protocol
└── design-review-slash-command.md     # Comprehensive design review agent template
```

## Available Agents (.claude/agents/)

**Content & Research:**
- `blog-writer.md` - Creates publication-ready blog posts from research
- `content-analyzer.md` - Analyzes competitor content for trends and gaps
- `content-researcher.md` - Gathers content intelligence from multiple sources
- `newsletter-writer.md` - Drafts newsletters in authentic voice
- `competitor-analyzer.md` - Performs competitive intelligence analysis
- `keyword-extractor.md` - Extracts SEO keywords and opportunities

**Market Research & Business:**
- `data-analyzer.md` - Analyzes market data and metrics
- `market-researcher.md` - Creates comprehensive market research reports
- `press-release-writer.md` - Generates media-ready press releases
- `media-researcher.md` - Identifies target journalists and publications

**Design & Development:**
- `design-review-agent.md` - Conducts world-class design reviews with Playwright
- `premium-ui-designer.md` - Creates sophisticated UI with premium aesthetics
- `meta-seo-agent.md` - Implements SEO meta tags and schema markup for Astro
- `meta-agent.md` - Generates new sub-agent configuration files

**Personal Development:**
- `daily-reflection.md` - Analyzes daily check-in patterns
- `metrics-analyst.md` - Tracks and visualizes weekly metrics

## Available Commands (.claude/commands/)

Run these with the `/` prefix (e.g., `/blog-research`)

**Content Creation:**
- `/blog-research` - Analyze competitor blogs and create SEO-optimized drafts
- `/newsletter-research` - Create newsletter drafts from competitor analysis
- `/press-release` - Generate professional press releases with media distribution plans

**Research & Analysis:**
- `/market-research [brief.md]` - Create comprehensive market research studies
- `/website-research [url]` - SEO audit, keyword extraction, competitive analysis
- `/youtube-research [search|url]` - Analyze YouTube content for SEO and strategy

**Personal Development:**
- `/daily-checkin` - Personal reflection and well-being tracking
- `/weekly-checkin` - Intelligent weekly progress tracking with adaptive metrics
- `/time-checkin` - Time-aware check-ins (morning/midday/evening)

**Utilities:**
- `/agent-creator` - Create new Claude Code agent configurations
- `/prompt-creator` - Generate optimized prompts

## Design Review Workflow

This repository includes a comprehensive design review system based on Stripe, Airbnb, and Linear standards:

### Quick Visual Check
After any front-end change:
1. Review modified components/pages
2. Navigate to affected pages using Playwright
3. Verify design compliance against `context/design-principles.md`
4. Validate feature implementation
5. Capture full-page screenshots (1440px viewport)
6. Check for console errors

### Comprehensive Design Review
Use the `design-review-agent` for thorough validation:
- Before finalizing PRs with visual changes
- After completing significant UI/UX features
- For accessibility and responsiveness testing

## Design Principles

The `context/design-principles.md` file contains an S-tier SaaS dashboard checklist covering:
- Core design philosophy (users first, meticulous craft, speed, simplicity)
- Design system foundation (color palettes, typography, spacing, components)
- Layout and visual hierarchy
- Interaction design and animations
- Module-specific tactics (multimedia moderation, data tables, configuration panels)
- CSS architecture recommendations (utility-first/Tailwind preferred)

## Using This Template

To use this starter for a new project:
1. Copy the `.claude/` directory to your new project
2. Copy `context/` files if you need design review workflows
3. Customize agents and commands for your specific project needs
4. Create a new project-specific `CLAUDE.md` with your application architecture
5. Remove or modify commands that don't apply to your project

## Creating New Agents

Use `/agent-creator` or `/meta-agent` to generate new agent configurations. New agents should be created in `.claude/agents/` following the existing template structure.

## Notes

- This template contains no application code - it's purely a collection of automation tools
- Agents are designed to work independently and can be mixed/matched for different projects
- Commands often chain multiple agents together for complex workflows
- The design review system assumes Playwright MCP is available for browser automation
