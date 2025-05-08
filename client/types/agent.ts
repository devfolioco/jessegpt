export enum AgentMoodEnum {
  EXCITED = 'excited',
  CRITICAL = 'critical',
}

export type AgentMoodI = AgentMoodEnum.CRITICAL | AgentMoodEnum.EXCITED;

export interface AgentShareData {
  oneLiner: string;
  summary: string;
}

export interface ZoraCoinResult {
  zoraLink: string;
  coinAddress: `0x${string}`;
  hash: `0x${string}`;
}
