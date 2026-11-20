import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentToolCall } from '../../core/models/api.models';

/** Collapsible list of what the agent ran: each tool call, its arguments and queries. */
@Component({
  selector: 'app-tool-trace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-trace.component.html',
  styleUrl: './tool-trace.component.scss',
})
export class ToolTraceComponent {
  @Input({ required: true }) calls: AgentToolCall[] = [];

  args(call: AgentToolCall): string {
    return Object.entries(call.arguments ?? {})
      .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
      .join(' · ');
  }

  params(params: Record<string, string>): string {
    return Object.entries(params ?? {}).map(([k, v]) => `:${k}=${v}`).join('  ');
  }
}
