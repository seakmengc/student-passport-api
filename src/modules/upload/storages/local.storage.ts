import { writeFile, rm, rename, mkdir } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { createReadStream } from 'fs';

export class LocalStorage {
  async getFile(pathStr: string) {
    return createReadStream(await this.getPath(pathStr));
  }

  // pipeStream(
  //   upload: { size: number; path: string; mimeType: string },
  //   res: FastifyReply,
  //   range?: string,
  // ) {
  //   const CHUNK_SIZE = 5 * 1_000_000; // 1_000_000 = 1MB
  //   const start = Number(range ? range.replace(/\D/g, '') : '0');
  //   const end = Math.min(start + CHUNK_SIZE, upload.size - 1);

  //   const readStream = GcsStorage.getInstance().getFile(upload.path, {
  //     start,
  //     end,
  //   });

  //   res.raw.writeHead(range ? 206 : 200, {
  //     'Content-Range': `bytes ${start}-${end}/${upload.size}`,
  //     'Accept-Ranges': 'bytes',
  //     'Content-Length': end - start + 1,
  //     'Content-Type': upload.mimeType,
  //   });

  //   readStream.pipe(res.raw);
  // }

  async putFile(pathStr: string, buffer: Buffer) {
    await writeFile(await this.getPath(pathStr), buffer, {});

    console.log('UPLOADED!');
  }

  async moveFile(fromPath: string, toPath: string) {
    await rename(await this.getPath(fromPath), await this.getPath(toPath));
  }

  async deleteFile(pathStr: string) {
    await rm(await this.getPath(pathStr));
  }

  private async getPath(pathStr: string) {
    const path = join(resolve('./'), 'storage', pathStr);

    await this.ensureDirectoryExistence(path);

    return path;
  }

  private async ensureDirectoryExistence(filePath: string) {
    const name = dirname(filePath);

    await mkdir(name, { recursive: true });
  }
}
