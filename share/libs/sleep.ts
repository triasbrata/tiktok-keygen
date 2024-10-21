export function sleep(second: number = 1) {
  return new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, 1000 * second)
  );
}
