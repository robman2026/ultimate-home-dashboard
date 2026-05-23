// Design tokens — injected into every card's shadow DOM
export const tokens = `
  :host {
    --sd-bg-deep:       #0b0f1e;
    --sd-bg-card:       rgba(18, 26, 52, 0.85);
    --sd-bg-section:    rgba(255,255,255,0.04);
    --sd-border:        rgba(255,255,255,0.10);
    --sd-border-glow:   rgba(255,255,255,0.20);

    --sd-text-primary:  #eef0f8;
    --sd-text-secondary:rgba(200,210,240,0.55);
    --sd-text-muted:    rgba(180,195,230,0.30);

    --sd-gold:    #f59e0b;
    --sd-green:   #10b981;
    --sd-blue:    #3b82f6;
    --sd-cyan:    #06b6d4;
    --sd-red:     #ef4444;
    --sd-purple:  #8b5cf6;
    --sd-orange:  #f97316;

    --sd-radius:  18px;
    --sd-radius-sm: 12px;
    --sd-blur:    blur(20px);
    --sd-font:    'Outfit', system-ui, sans-serif;
    --sd-mono:    'JetBrains Mono', monospace;
    --sd-transition: 0.2s ease;
  }
`;

export const baseCard = `
  ${tokens}

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :host {
    display: block;
    font-family: var(--sd-font);
    color: var(--sd-text-primary);
  }

  .card {
    background: var(--sd-bg-card);
    border: 1px solid var(--sd-border);
    border-radius: var(--sd-radius);
    backdrop-filter: var(--sd-blur);
    -webkit-backdrop-filter: var(--sd-blur);
    padding: 16px;
    position: relative;
    overflow: hidden;
    transition: border-color var(--sd-transition);
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }
  .card:hover { border-color: var(--sd-border-glow); }

  .label {
    font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--sd-text-secondary);
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .label .dot {
    width: 7px; height: 7px; border-radius: 50%;
  }

  .value-big {
    font-size: 32px; font-weight: 200;
    color: var(--sd-text-primary); line-height: 1;
  }
  .value-sub {
    font-size: 11px; color: var(--sd-text-secondary); margin-top: 2px;
  }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 8px;
    font-size: 10px; font-weight: 700;
  }
  .badge.green { background: rgba(16,185,129,0.15); color: var(--sd-green); }
  .badge.red   { background: rgba(239,68,68,0.15);  color: var(--sd-red);   }
  .badge.blue  { background: rgba(59,130,246,0.15); color: var(--sd-blue);  }
  .badge.gold  { background: rgba(245,158,11,0.15); color: var(--sd-gold);  }

  .sensor-dot {
    width: 8px; height: 8px; border-radius: 50%;
    display: inline-block; flex-shrink: 0;
  }
`;
