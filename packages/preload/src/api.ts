import { ipcRenderer } from 'electron';
import IpcRendererEvent = Electron.IpcRendererEvent;


export function on(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void {
  ipcRenderer.on(channel, listener);
}

export function removeListener(channel: string, listener: (...args: unknown[]) => void): void {
  ipcRenderer.removeListener(channel, listener);
}

export const ipc = ipcRenderer;
