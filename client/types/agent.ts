export enum AgentMoodEnum {
  EXCITED = 'excited',
  CRITICAL = 'critical',
}

export type AgentMoodI = AgentMoodEnum.CRITICAL | AgentMoodEnum.EXCITED;
