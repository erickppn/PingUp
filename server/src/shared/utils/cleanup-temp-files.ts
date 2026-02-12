import { FileData } from "@/shared/providers/media/media.provider";
import { cleanupTempPaths } from "./cleanup-tem-paths";

export async function cleanupTempFiles(
  files: FileData[] = []
) {
  const paths = files.map(file => file.tempPath);

  await cleanupTempPaths(paths);
}
