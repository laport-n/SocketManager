export class JSONUtils {
  public static isParsable(value: string | null): boolean {
    try {
      if (value) {
        if (JSON.parse(value)) return true;
        return false;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}
