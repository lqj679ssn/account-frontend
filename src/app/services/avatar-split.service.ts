import {Injectable} from '@angular/core';

@Injectable()
export class AvatarSplitService {
  // Errors & Warnings
  public static ERROR_TOO_LARGE_IMAGE_SIZE = '图片尺寸不得超过10M';
  public static ERROR_IS_UPLOADING = '正在上传…';

  public static MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  public avatar_file: File;
}
