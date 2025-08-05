export async function readTemplate(filename: string): Promise<string> {
  const assets = useStorage("assets:server");
  const raw = await assets.getItem<string | Uint8Array>(
    `templates/${filename}`
  );

  if (!raw) {
    throw new Error(
      `Template "${filename}" not found in server/assets/templates`
    );
  }

  const template =
    typeof raw === "string" ? raw : new TextDecoder().decode(raw);

  return template;
}
