export class Property {
  /**
   *
   * @param setTo Object
   * @param from Object
   * @returns array of keys that has been updated (diff)
   */
  static setProperties(setTo: any, from: any): string[] {
    const updates: string[] = [];
    for (const key in from) {
      if (setTo[key] === from[key]) {
        continue;
      }

      setTo[key] = from[key];
      updates.push(key);
    }

    return updates;
  }
}
