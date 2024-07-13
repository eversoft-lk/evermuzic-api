export async function hashPassword(password: string): Promise<string> {
  return await crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(password))
    .then((hash) => {
      const hashArray = Array.from(new Uint8Array(hash));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    });
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}
