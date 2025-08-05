export async function readTemplate(filename: string): Promise<string> {
  const assets = useStorage("assets:server");
  const template = await assets.getItem<string>(`templates/${filename}`);

  if (!template) {
    throw new Error(
      `Template "${filename}" not found in server/assets/templates`
    );
  }

  return template;
}
