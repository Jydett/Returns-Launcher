
export type CarouselItem = {
  id: number;
  title: string;
  image: string;
  link: string;
};

export type Manifest = {
  launcherVersion: string;
  gameVersion: string;
  carousel: Array<CarouselItem>;
};

export enum DebugMode {
  NO_DEBUG = 'NO_DEBUG',
  JMX = 'JMX',
  AGENT = 'AGENT',
  AGENT_SUSPENDED = 'AGENT_SUSPENDED'
}

export const DebugModeValues: DebugMode[] = [DebugMode.NO_DEBUG, DebugMode.JMX, DebugMode.AGENT, DebugMode.AGENT_SUSPENDED];
export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export const LogLevelValues: LogLevel[] = [
  LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO,
  LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL,
];
