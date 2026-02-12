import fs from "fs/promises";

export async function cleanupTempPaths(
  paths: string[] = []
) {
  await Promise.all(
    paths.map(path =>
      fs.unlink(path).catch(() => {})
    )
  )
}
