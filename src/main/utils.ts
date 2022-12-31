import { Constants } from "./constants";
import path from "path";
import fs from "fs";
import { IPC } from "./ipc";
import { EOL } from "os";

export namespace Utils {
  export const buildJavaArgs = (platform: NodeJS.Platform) => {
    const javaArgs: Array<string> = [];

    // Library Path
    switch (platform) {
      case "win32":
        javaArgs.push(`-Djava.library.path=..\\natives\\win32\\x86;..\\jre\\bin`);
        break;
      case "linux":
        javaArgs.push(`-Djava.library.path=../natives/linux/x86:../jre/bin`);
        break;
    }

    // Game related args
    javaArgs.push("-client");

    // JVM Args
    javaArgs.push("-Xmx384M");
    javaArgs.push("-Xms192M");
    javaArgs.push("-Dsun.awt.noerasebackground=true");
    javaArgs.push("-Dhttp.agent=DofusArenaClient"); // Fix a nasty bug with in-game bug reports
    javaArgs.push("-XX:MaxDirectMemorySize=92m");
    javaArgs.push("-XX:+ForceTimeHighResolution");
    javaArgs.push("-XX:MinHeapFreeRatio=10");
    javaArgs.push("-XX:MaxHeapFreeRatio=20");
    javaArgs.push("-Xss256k");

    // JMX Remote in Dev Mode
    if (IPC.isDevMode()) {
      javaArgs.push("-Dcom.sun.management.jmxremote");
      javaArgs.push("-Dcom.sun.management.jmxremote.port=9010");
      javaArgs.push("-Dcom.sun.management.jmxremote.rmi.port=9010");
      javaArgs.push("-Dcom.sun.management.jmxremote.local.only=false");
      javaArgs.push("-Dcom.sun.management.jmxremote.authenticate=false");
      javaArgs.push("-Dcom.sun.management.jmxremote.ssl=false");
    }

    // Classpath
    const classPath = [];
    const libPath = path.join(Constants.GAME_PATH, "lib");
    const libFiles = fs.readdirSync(libPath);
    // The dark magic we use to patch bugs requires the wrapper to be loaded after the client.
    classPath.push("core.jar");
    classPath.push("wrapper.jar");
    switch (platform) {
      case "win32":
        libFiles.forEach((file) => {
          classPath.push(`..\\lib\\${file}`);
        });
        javaArgs.push(`-Djava.class.path=${classPath.join(";")}`);
        break;
      case "linux":
        libFiles.forEach((file) => {
          classPath.push(`../lib/${file}`);
        });
        javaArgs.push(`-Djava.class.path=${classPath.join(":")}`);
        break;
    }

    // Wrapper entrypoint
    javaArgs.push("com.arenareturns.client.ArenaReturnsWrapper");

    return javaArgs.join(" ");
  };

  /**
   * Return a property file buffer as a String optained from merging localProperties with newProperties.
   * The merging process keeps all line in the new properties and if a line is a property definition (*=*),
   *  the value from the localProperties is kept if it exists otherwise the new value is used.
   *
   * @param localProperties
   * @param newProperties
   */
  export const mergeProperties = (localProperties: String, newProperties: String) => {
    const localPropertiesMap: { [_: string]: string } = localProperties.split(EOL)
      .filter(line => line.trim() || !line.startsWith("#") || line.indexOf("=") != -1)
      .reduce(function (a, line) {
        const equalIndex = line.indexOf("=");
        return {...a, [line.substring(0, equalIndex)]: line.substring(equalIndex + 1)};
      }, {});
    return newProperties.split(EOL)
      .map(line => {
        const equalIndex = line.indexOf("=");
        if (line.trim() || !line.startsWith("#") || equalIndex != -1) {
          const key = line.substring(0, equalIndex);
          const localValue = localPropertiesMap[key];
          if (localValue) {
            return key + "=" + localValue;
          }
        }
        return line;
      }).join(EOL);
  };
}
