import fs from "fs/promises";
import { FileData } from "@/shared/providers/media/media.provider";

export async function cleanupTempFiles(
  files: FileData[] = []
) {
  await Promise.all(
    files.map(file =>
      fs.unlink(file.tempPath).catch(() => {})
    )
  )
}
